/**
 * USFM Book Codes for YouVersion API
 * Maps common book names to their 3-character USFM identifiers
 */

export const BOOK_CODES: Record<string, string> = {
    // Old Testament
    genesis: "GEN",
    gen: "GEN",
    exodus: "EXO",
    exo: "EXO",
    ex: "EXO",
    leviticus: "LEV",
    lev: "LEV",
    numbers: "NUM",
    num: "NUM",
    deuteronomy: "DEU",
    deut: "DEU",
    deu: "DEU",
    joshua: "JOS",
    josh: "JOS",
    jos: "JOS",
    judges: "JDG",
    judg: "JDG",
    jdg: "JDG",
    ruth: "RUT",
    "1samuel": "1SA",
    "1sam": "1SA",
    "1sa": "1SA",
    "2samuel": "2SA",
    "2sam": "2SA",
    "2sa": "2SA",
    "1kings": "1KI",
    "1ki": "1KI",
    "2kings": "2KI",
    "2ki": "2KI",
    "1chronicles": "1CH",
    "1chron": "1CH",
    "1ch": "1CH",
    "2chronicles": "2CH",
    "2chron": "2CH",
    "2ch": "2CH",
    ezra: "EZR",
    ezr: "EZR",
    nehemiah: "NEH",
    neh: "NEH",
    esther: "EST",
    est: "EST",
    job: "JOB",
    psalms: "PSA",
    psalm: "PSA",
    psa: "PSA",
    ps: "PSA",
    proverbs: "PRO",
    prov: "PRO",
    pro: "PRO",
    ecclesiastes: "ECC",
    eccl: "ECC",
    ecc: "ECC",
    "songofsolomon": "SNG",
    "song": "SNG",
    sng: "SNG",
    isaiah: "ISA",
    isa: "ISA",
    jeremiah: "JER",
    jer: "JER",
    lamentations: "LAM",
    lam: "LAM",
    ezekiel: "EZK",
    ezek: "EZK",
    ezk: "EZK",
    daniel: "DAN",
    dan: "DAN",
    hosea: "HOS",
    hos: "HOS",
    joel: "JOL",
    jol: "JOL",
    amos: "AMO",
    amo: "AMO",
    obadiah: "OBA",
    obad: "OBA",
    oba: "OBA",
    jonah: "JON",
    jon: "JON",
    micah: "MIC",
    mic: "MIC",
    nahum: "NAM",
    nah: "NAM",
    nam: "NAM",
    habakkuk: "HAB",
    hab: "HAB",
    zephaniah: "ZEP",
    zeph: "ZEP",
    zep: "ZEP",
    haggai: "HAG",
    hag: "HAG",
    zechariah: "ZEC",
    zech: "ZEC",
    zec: "ZEC",
    malachi: "MAL",
    mal: "MAL",

    // New Testament
    matthew: "MAT",
    matt: "MAT",
    mat: "MAT",
    mt: "MAT",
    mark: "MRK",
    mrk: "MRK",
    mk: "MRK",
    luke: "LUK",
    luk: "LUK",
    lk: "LUK",
    john: "JHN",
    jhn: "JHN",
    jn: "JHN",
    acts: "ACT",
    act: "ACT",
    romans: "ROM",
    rom: "ROM",
    "1corinthians": "1CO",
    "1cor": "1CO",
    "1co": "1CO",
    "2corinthians": "2CO",
    "2cor": "2CO",
    "2co": "2CO",
    galatians: "GAL",
    gal: "GAL",
    ephesians: "EPH",
    eph: "EPH",
    philippians: "PHP",
    phil: "PHP",
    php: "PHP",
    colossians: "COL",
    col: "COL",
    "1thessalonians": "1TH",
    "1thess": "1TH",
    "1th": "1TH",
    "2thessalonians": "2TH",
    "2thess": "2TH",
    "2th": "2TH",
    "1timothy": "1TI",
    "1tim": "1TI",
    "1ti": "1TI",
    "2timothy": "2TI",
    "2tim": "2TI",
    "2ti": "2TI",
    titus: "TIT",
    tit: "TIT",
    philemon: "PHM",
    phlm: "PHM",
    phm: "PHM",
    hebrews: "HEB",
    heb: "HEB",
    james: "JAS",
    jas: "JAS",
    "1peter": "1PE",
    "1pet": "1PE",
    "1pe": "1PE",
    "2peter": "2PE",
    "2pet": "2PE",
    "2pe": "2PE",
    "1john": "1JN",
    "1jn": "1JN",
    "2john": "2JN",
    "2jn": "2JN",
    "3john": "3JN",
    "3jn": "3JN",
    jude: "JUD",
    jud: "JUD",
    revelation: "REV",
    rev: "REV",
};

export interface ParsedReference {
    book: string; // USFM code (e.g., "MAT")
    chapter?: number;
    verse?: number;
    endVerse?: number;
    formatted: string; // API format (e.g., "MAT.2" or "MAT.2.3")
    display: string; // Human readable (e.g., "Matthew 2" or "Matthew 2:3")
}

/**
 * Parse a scripture reference and convert to YouVersion API format
 * Supports formats like:
 * - "Matthew 2"
 * - "John 3:16"
 * - "Romans 12:1-2"
 * - "1 Corinthians 13"
 */
export function parseScriptureReference(
    input: string
): ParsedReference | null {
    if (!input || typeof input !== "string") return null;

    // Clean and normalize input
    const cleaned = input.trim().toLowerCase();

    // Pattern: Book Chapter:Verse-EndVerse
    // Examples: "Matthew 2", "John 3:16", "Romans 12:1-2"
    const pattern =
        /^((?:\d\s*)?[a-z]+(?:\s+of\s+[a-z]+)?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/i;
    const match = cleaned.match(pattern);

    if (!match) return null;

    const [, bookName, chapterStr, verseStr, endVerseStr] = match;

    // Normalize book name (remove spaces for lookup)
    const normalizedBook = bookName.replace(/\s+/g, "").toLowerCase();
    const bookCode = BOOK_CODES[normalizedBook];

    if (!bookCode) return null;

    const chapter = parseInt(chapterStr, 10);
    const verse = verseStr ? parseInt(verseStr, 10) : undefined;
    const endVerse = endVerseStr ? parseInt(endVerseStr, 10) : undefined;

    // Build API format
    let formatted = `${bookCode}.${chapter}`;
    if (verse) {
        formatted += `.${verse}`;
        if (endVerse) {
            formatted += `-${bookCode}.${chapter}.${endVerse}`;
        }
    }

    // Build display format
    const bookDisplay = getBookDisplayName(bookCode);
    let display = `${bookDisplay} ${chapter}`;
    if (verse) {
        display += `:${verse}`;
        if (endVerse) {
            display += `-${endVerse}`;
        }
    }

    return {
        book: bookCode,
        chapter,
        verse,
        endVerse,
        formatted,
        display,
    };
}

/**
 * Get the display name for a book code
 */
function getBookDisplayName(code: string): string {
    const displayNames: Record<string, string> = {
        GEN: "Genesis",
        EXO: "Exodus",
        LEV: "Leviticus",
        NUM: "Numbers",
        DEU: "Deuteronomy",
        JOS: "Joshua",
        JDG: "Judges",
        RUT: "Ruth",
        "1SA": "1 Samuel",
        "2SA": "2 Samuel",
        "1KI": "1 Kings",
        "2KI": "2 Kings",
        "1CH": "1 Chronicles",
        "2CH": "2 Chronicles",
        EZR: "Ezra",
        NEH: "Nehemiah",
        EST: "Esther",
        JOB: "Job",
        PSA: "Psalms",
        PRO: "Proverbs",
        ECC: "Ecclesiastes",
        SNG: "Song of Solomon",
        ISA: "Isaiah",
        JER: "Jeremiah",
        LAM: "Lamentations",
        EZK: "Ezekiel",
        DAN: "Daniel",
        HOS: "Hosea",
        JOL: "Joel",
        AMO: "Amos",
        OBA: "Obadiah",
        JON: "Jonah",
        MIC: "Micah",
        NAM: "Nahum",
        HAB: "Habakkuk",
        ZEP: "Zephaniah",
        HAG: "Haggai",
        ZEC: "Zechariah",
        MAL: "Malachi",
        MAT: "Matthew",
        MRK: "Mark",
        LUK: "Luke",
        JHN: "John",
        ACT: "Acts",
        ROM: "Romans",
        "1CO": "1 Corinthians",
        "2CO": "2 Corinthians",
        GAL: "Galatians",
        EPH: "Ephesians",
        PHP: "Philippians",
        COL: "Colossians",
        "1TH": "1 Thessalonians",
        "2TH": "2 Thessalonians",
        "1TI": "1 Timothy",
        "2TI": "2 Timothy",
        TIT: "Titus",
        PHM: "Philemon",
        HEB: "Hebrews",
        JAS: "James",
        "1PE": "1 Peter",
        "2PE": "2 Peter",
        "1JN": "1 John",
        "2JN": "2 John",
        "3JN": "3 John",
        JUD: "Jude",
        REV: "Revelation",
    };

    return displayNames[code] || code;
}

/**
 * Validate a scripture reference
 */
export function validateScriptureReference(input: string): {
    valid: boolean;
    error?: string;
    parsed?: ParsedReference;
} {
    if (!input || !input.trim()) {
        return { valid: false, error: "Please enter a scripture reference" };
    }

    const parsed = parseScriptureReference(input);

    if (!parsed) {
        return {
            valid: false,
            error:
                "Invalid format. Use format like 'Matthew 2' or 'John 3:16' or 'Romans 12:1-2'",
        };
    }

    return { valid: true, parsed };
}
