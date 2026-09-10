"""
VieNeu-TTS v3 Turbo (int8) — CPU streaming demo (FastAPI).
==========================================================
Stream 48 kHz audio ngay khi generate, qua `V3TurboVieNeuTTS.infer_stream` (đường
ONNX/CPU int8 mặc định). Vì RTF < 1 (int8 nhanh hơn realtime), stream chạy mượt
không underrun — chỉ cần player prebuffer ~300–500ms.

    uv run python -m apps.web_stream        # http://127.0.0.1:8001

Public API dùng ở đây:
    vieneu = Vieneu(backend="onnx")                    # v3 Turbo int8, ép CPU/ONNX
    for chunk in vieneu.infer_stream(text, voice="Minh Đức"):
        ...                                         # np.float32 @ 48kHz, phát/ghi dần
"""
import time
import io
import wave
from pathlib import Path
from typing import Optional

import numpy as np
from fastapi import FastAPI
from fastapi.responses import FileResponse, StreamingResponse, Response
from pydantic import BaseModel
import uvicorn

from vieneu import Vieneu

SAMPLE_RATE = 48_000
app = FastAPI()
vieneu = None

ROOT_DIR = Path(__file__).resolve().parent

CLIENT_HTML_PATH = ROOT_DIR / "client" / "client.html"



def load_model():
    global vieneu
    import os
    print(f"⏳ Loading VieNeu-TTS v3 Turbo ({os.environ.get('VIENEU_PRECISION', 'fp32')}, CPU)...")
    vieneu = Vieneu(
        # backend="onnx",                                  # == mode="v3turbo", force CPU/ONNX
        precision=os.environ.get("VIENEU_PRECISION", "fp32"),
        onnx_dir=os.environ.get("VIENEU_ONNX_DIR") or None,
    )

    vieneu.add_voice(
        "my-custom-voice",
        "audios/chip-voice.wav",
        denoise=True,
    )

    vieneu.save_voices()  

    print(f"✅ Ready. Backbone: {os.environ.get('VIENEU_PRECISION', 'fp32')} | intra_op threads: {getattr(vieneu.engine, 'ort_intra_op_threads', '?')}")


load_model()

@app.get("/voices")
async def voices():
    try:
        vs = vieneu.list_preset_voices()
        out = []
        for item in vs:
            if isinstance(item, (tuple, list)) and len(item) == 2:
                label, vid = item
                out.append({"id": vid, "name": label})
            else:
                out.append({"id": str(item), "name": str(item)})
        return out or [{"id": "", "name": "(no preset voices)"}]
    except Exception as e:  # noqa: BLE001
        return [{"id": "", "name": f"⚠️ {e}"}]


def _pcm16(audio_f32: np.ndarray) -> bytes:
    return (np.asarray(audio_f32) * 32767).clip(-32768, 32767).astype(np.int16).tobytes()


@app.get("/stream")
async def stream(text: str):
    def gen():
        h = io.BytesIO()
        with wave.open(h, "wb") as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(SAMPLE_RATE)
            w.setnframes(1_000_000_000)
        yield h.getvalue()

        t0 = time.perf_counter()
        first_at = None
        n_chunks = 0
        emitted = 0
        for chunk in vieneu.infer_stream(text, voice="my-custom-voice" or None):
            if chunk is None or len(chunk) == 0:
                continue
            if first_at is None:
                first_at = time.perf_counter() - t0
                print(f"⚡ TTFA (time-to-first-audio): {first_at*1000:.0f} ms")
            n_chunks += 1
            emitted += len(chunk)
            yield _pcm16(chunk)
        if first_at is not None:
            gen_time = time.perf_counter() - t0
            audio_s = emitted / SAMPLE_RATE
            rtf = gen_time / audio_s if audio_s else 0
            print(f"✅ {n_chunks} chunks | audio {audio_s:.2f}s | gen {gen_time:.2f}s "
                  f"| RTF {rtf:.3f} ({1/rtf:.1f}x realtime)" if rtf else "")

    return StreamingResponse(gen(), media_type="audio/wav")


class StreamReq(BaseModel):
    text: str
    voice_id: Optional[str] = None


@app.post("/stream")
async def stream_post(req: StreamReq):
    return await stream(req.text, req.voice_id)


def main():
    uvicorn.run(app, host="0.0.0.0", port=8189)


if __name__ == "__main__":
    main()
