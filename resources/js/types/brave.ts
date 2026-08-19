export interface BraveSearchRequest {
    q: string;
    country?: 'US' | 'VN' | 'JP';
    search_lang?: 'en' | 'vi' | 'ja';
    count?: number; // max 20
    offset?: number; //max 9, default 0
    safesearch?: 'moderate' | 'off' | 'strict'; // default 'moderate'
    spellcheck?: 'true' | 'false'; // default 'true'
    freshness?: 'pd' | 'pw' | 'pm' | 'py'; // default ''
}