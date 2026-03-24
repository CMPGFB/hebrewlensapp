import React, { useState, useRef } from 'react';
import { Search, Share2, Book, Languages, Type, CheckCircle, AlertCircle, Info, Instagram, Download, X, Heart, Bitcoin, Wallet, Banknote, Zap, CreditCard } from 'lucide-react';
import { toPng } from 'html-to-image';
import { translateWithAI } from './lib/openai';


interface HebrewLetter {
  hebrew: string;
  name: string;
  meaning: string;
  pictograph?: string;
  transliteration: string;
  commonWords?: string[];
  frequency?: number;
  specialTerms?: { english: string; hebrew: string }[];
}

const hebrewAlphabet: HebrewLetter[] = [
  { 
    hebrew: 'א', 
    name: 'Aleph', 
    meaning: 'Strength/Leader', 
    pictograph: '🐂', 
    transliteration: 'a', 
    commonWords: ['אב (av) - father', 'אור (or) - light', 'אדם (adam) - man', 'אמת (emet) - truth'], 
    frequency: 7.3,
    specialTerms: [
      { english: 'Elohim', hebrew: 'אלהים' },
      { english: 'El', hebrew: 'אל' },
      { english: 'Adonai', hebrew: 'אדני' }
    ]
  },
  { hebrew: 'ב', name: 'Bet', meaning: 'House/Family', pictograph: '🏠', transliteration: 'b', commonWords: ['בית (bayit) - house', 'בן (ben) - son', 'ברית (brit) - covenant'] },
  { hebrew: 'ג', name: 'Gimel', meaning: 'Camel/Lift Up', pictograph: '🐪', transliteration: 'g', commonWords: ['גדול (gadol) - big', 'גן (gan) - garden'] },
  { hebrew: 'ד', name: 'Dalet', meaning: 'Door/Pathway', pictograph: '🚪', transliteration: 'd', commonWords: ['דרך (derech) - way', 'דבר (davar) - word'] },
  { hebrew: 'ה', name: 'Hey', meaning: 'Behold/Reveal', pictograph: '👀', transliteration: 'h', commonWords: ['הר (har) - mountain', 'הוא (hu) - he'] },
  { hebrew: 'ו', name: 'Vav', meaning: 'Hook/Connect', pictograph: '🪝', transliteration: 'v', commonWords: ['ולד (veled) - child', 'ורד (vered) - rose'] },
  { hebrew: 'ז', name: 'Zayin', meaning: 'Weapon/Cut', pictograph: '🗡️', transliteration: 'z', commonWords: ['זמן (zman) - time', 'זהב (zahav) - gold'] },
  { hebrew: 'ח', name: 'Chet', meaning: 'Fence/Separate', pictograph: '🏗️', transliteration: 'ch', commonWords: ['חיים (chaim) - life', 'חלום (chalom) - dream'] },
  { hebrew: 'ט', name: 'Tet', meaning: 'Snake/Surround', pictograph: '🐍', transliteration: 't', commonWords: ['טוב (tov) - good', 'טל (tal) - dew'] },
  { hebrew: 'י', name: 'Yod', meaning: 'Hand/Work', pictograph: '🤚', transliteration: 'y', commonWords: ['יד (yad) - hand', 'ים (yam) - sea'] },
  { hebrew: 'כ', name: 'Kaf', meaning: 'Palm/Open', pictograph: '✋', transliteration: 'k', commonWords: ['כוכב (kochav) - star', 'כלב (kelev) - dog'] },
  { hebrew: 'ל', name: 'Lamed', meaning: 'Staff/Teach', pictograph: '🦯', transliteration: 'l', commonWords: ['לב (lev) - heart', 'לחם (lechem) - bread'] },
  { hebrew: 'מ', name: 'Mem', meaning: 'Water/Chaos', pictograph: '🌊', transliteration: 'm', commonWords: ['מים (mayim) - water', 'מלך (melech) - king'] },
  { hebrew: 'נ', name: 'Nun', meaning: 'Seed/Continue', pictograph: '🌱', transliteration: 'n', commonWords: ['נר (ner) - candle', 'נפש (nefesh) - soul'] },
  { hebrew: 'ס', name: 'Samech', meaning: 'Support/Turn', pictograph: '🔄', transliteration: 's', commonWords: ['ספר (sefer) - book', 'סוס (sus) - horse'] },
  { hebrew: 'ע', name: 'Ayin', meaning: 'Eye/See', pictograph: '👁️', transliteration: '', commonWords: ['עין (ayin) - eye', 'עץ (etz) - tree'] },
  { hebrew: 'פ', name: 'Pey', meaning: 'Mouth/Speak', pictograph: '👄', transliteration: 'p', commonWords: ['פה (peh) - mouth', 'פרי (pri) - fruit'] },
  { hebrew: 'צ', name: 'Tzade', meaning: 'Fish Hook/Catch', pictograph: '🎣', transliteration: 'ts', commonWords: ['צדק (tzedek) - justice', 'ציון (tzion) - Zion'] },
  { hebrew: 'ק', name: 'Qof', meaning: 'Back of Head/Last', pictograph: '👤', transliteration: 'q', commonWords: ['קול (kol) - voice', 'קדוש (kadosh) - holy'] },
  { hebrew: 'ר', name: 'Resh', meaning: 'Head/First', pictograph: '👨', transliteration: 'r', commonWords: ['ראש (rosh) - head', 'רוח (ruach) - spirit'] },
  { hebrew: 'ש', name: 'Shin', meaning: 'Teeth/Consume', pictograph: '🦷', transliteration: 'sh', commonWords: ['שמש (shemesh) - sun', 'שלום (shalom) - peace'] },
  { hebrew: 'ת', name: 'Tav', meaning: 'Mark/Covenant', pictograph: '✒️', transliteration: 't', commonWords: ['תורה (torah) - Torah', 'תפילה (tefillah) - prayer'] }
];

interface TranslationStep {
  original: string;
  transliterated: string;
  hebrew: string;
  confidence: number;
  confidenceFactors: {
    letterMatch: number;
    commonWordMatch: number;
    patternMatch: number;
    contextMatch: number;
  };
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<HebrewLetter | null>(null);
  const [donationType, setDonationType] = useState<'bitcoin' | 'crypto' | 'cash'>('bitcoin');
  const [inputText, setInputText] = useState('');
  const [hebrewText, setHebrewText] = useState('');
  const [analyzedText, setAnalyzedText] = useState<HebrewLetter[]>([]);
  const [translationSteps, setTranslationSteps] = useState<TranslationStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showShareCard, setShowShareCard] = useState(false);

  const [showGuide, setShowGuide] = useState(false);
  const [showDonation, setShowDonation] = useState(false);
  const [pendingDownload, setPendingDownload] = useState(false);
  const alphabetContainerRef = useRef<HTMLDivElement>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const triggerDownload = async () => {
    if (!shareCardRef.current || !hebrewText) return;
    try {
      // Small delay to ensure styles are applied
      await new Promise(resolve => setTimeout(resolve, 100));
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
        onclone: (clonedDoc) => {
          const element = clonedDoc.querySelector('[data-share-header]');
          if (element instanceof HTMLElement) {
            element.style.padding = '40px';
          }
        }
      });
      const url = canvas.toDataURL('image/png', 1.0);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hebrew-translation-${Date.now()}.png`;
      a.click();
    } catch (err) {
      console.error('Failed to generate image:', err);
      // Fallback
      alert('Could not generate the image at this time. Please try taking a screenshot instead.');
    } finally {
      setPendingDownload(false);
      setShowDonation(false);
    }
  };

  const handleDownloadRequest = () => {
    setPendingDownload(true);
    setShowDonation(true);
  };

  const scrollAlphabet = (direction: 'left' | 'right') => {
    if (!alphabetContainerRef.current) return;
    
    const container = alphabetContainerRef.current;
    const cardWidth = 160; // Width of each card + spacing
    const visibleCards = Math.floor(container.clientWidth / cardWidth);
    const scrollAmount = cardWidth * visibleCards;
    
    const targetScroll = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;
    
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  };

  const generateShareableImage = async () => {
    if (!shareCardRef.current || !hebrewText) return;

    try {
      const dataUrl = await toPng(shareCardRef.current, {
        quality: 0.95,
        backgroundColor: '#ffffff'
      });

      const link = document.createElement('a');
      link.download = 'hebrew-translation.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating image:', err);
    }
  };

  const calculateLetterMatchConfidence = (word: string, translation: string): number => {
    const expectedLength = word.replace(/[^a-zA-Z]/g, '').length;
    const actualLength = translation.length;
    return Math.min((actualLength / expectedLength) * 100, 100);
  };

  const calculateCommonWordMatchConfidence = (translation: string): number => {
    const commonWords = hebrewAlphabet.flatMap(letter => letter.commonWords || []);
    const matches = commonWords.filter(word => word.includes(translation));
    return matches.length > 0 ? 100 : 50;
  };

  const calculatePatternMatchConfidence = (word: string, translation: string): number => {
    const patterns = [
      /^מ/,
      /ים$/,
      /ות$/,
    ];
    
    const matchesPattern = patterns.some(pattern => pattern.test(translation));
    return matchesPattern ? 90 : 70;
  };

  const calculateContextMatchConfidence = (word: string): number => {
    const commonContexts = ['shalom', 'torah', 'israel', 'hebrew'];
    return commonContexts.includes(word.toLowerCase()) ? 100 : 75;
  };

  const calculateConfidenceFactors = (word: string, translation: string) => {
    return {
      letterMatch: calculateLetterMatchConfidence(word, translation),
      commonWordMatch: calculateCommonWordMatchConfidence(translation),
      patternMatch: calculatePatternMatchConfidence(word, translation),
      contextMatch: calculateContextMatchConfidence(word)
    };
  };

  const translateToHebrew = (text: string): { hebrew: string; steps: TranslationStep[] } => {
    const words = text.split(/\s+/);
    const steps: TranslationStep[] = [];
    const translatedWords: string[] = [];
    
    // Check for special terms first
    const specialTermsMap = new Map(
      hebrewAlphabet.flatMap(letter => 
        letter.specialTerms?.map(term => [term.english.toLowerCase(), term.hebrew]) || []
      )
    );

    for (const word of words) {
      const lowerWord = word.toLowerCase();
      
      // Check if it's a special term
      if (specialTermsMap.has(lowerWord)) {
        const hebrewWord = specialTermsMap.get(lowerWord)!;
        const confidenceFactors = {
          letterMatch: 100,
          commonWordMatch: 100,
          patternMatch: 100,
          contextMatch: 100
        };
        
        steps.push({
          original: word,
          transliterated: lowerWord,
          hebrew: hebrewWord,
          confidence: 100,
          confidenceFactors
        });
        
        translatedWords.push(hebrewWord);
        continue;
      }
      
      let hebrewWord = '';
      let i = 0;
      const originalWord = word;

      while (i < lowerWord.length) {
        let matched = false;
        if (i < lowerWord.length - 1) {
          const twoChars = lowerWord.slice(i, i + 2);
          const matchingLetter = hebrewAlphabet.find(letter => letter.transliteration === twoChars);
          if (matchingLetter) {
            hebrewWord += matchingLetter.hebrew;
            i += 2;
            matched = true;
            continue;
          }
        }
        if (!matched) {
          const char = lowerWord[i];
          const matchingLetter = hebrewAlphabet.find(letter => letter.transliteration === char);
          if (matchingLetter) {
            hebrewWord += matchingLetter.hebrew;
          }
          i++;
        }
      }

      const confidenceFactors = calculateConfidenceFactors(originalWord, hebrewWord);
      const confidence = (
        confidenceFactors.letterMatch +
        confidenceFactors.commonWordMatch +
        confidenceFactors.patternMatch +
        confidenceFactors.contextMatch
      ) / 4;

      steps.push({
        original: originalWord,
        transliterated: lowerWord,
        hebrew: hebrewWord,
        confidence,
        confidenceFactors
      });
      translatedWords.push(hebrewWord);
    }

    return {
      hebrew: translatedWords.join(' '),
      steps
    };
  };

  const handleTranslate = async () => {
    if (isLoading || !inputText.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const aiHebrew = await translateWithAI(inputText);
      if (!aiHebrew) throw new Error('Could not get translation from AI');
      const { steps } = translateToHebrew(inputText);
      setHebrewText(aiHebrew);
      setTranslationSteps(steps);
      const letters = Array.from(aiHebrew).filter(char => char !== ' ');
      setAnalyzedText(letters.map(char =>
        hebrewAlphabet.find(letter => letter.hebrew === char)
      ).filter((letter): letter is HebrewLetter => letter !== undefined));
    } catch (err) {
      setError('Failed to translate. Please check your API key and network.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-gray-900">HebrewLens</h1>
            </div>
            <nav className="flex space-x-4">
              <button
                onClick={() => setShowGuide(true)}
                className="text-gray-600 hover:text-gray-900 flex items-center space-x-1"
              >
                <Book className="h-5 w-5" />
                <span className="hidden sm:inline">Guide</span>
              </button>
              <button
                className="text-rose-600 hover:text-rose-700 flex items-center space-x-1"
                onClick={() => setShowDonation(true)}
              >
                <Heart className="h-5 w-5" />
                <span className="hidden sm:inline">Support Us</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 space-y-8">
        {/* Translation Input Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Type className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-semibold">English to Hebrew Translation</h2>
          </div>
          <textarea
            className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter English text to translate..."
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleTranslate();
              }
            }}
          />
          <button
            className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            disabled={isLoading || !inputText.trim()}
            onClick={handleTranslate}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                <span>Translating...</span>
              </>
            ) : (
              <span>Translate & Analyze</span>
            )}
          </button>

          {/* Animated Progress Bar */}
          {isLoading && (
            <div className="mt-3 space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-full animate-pulse"
                  style={{
                    width: '100%',
                    animation: 'progressShimmer 1.5s ease-in-out infinite',
                    backgroundSize: '200% 100%',
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 text-center animate-pulse">Analyzing ancient Hebrew letters & translating with AI...</p>
              <style>{`
                @keyframes progressShimmer {
                  0% { background-position: -200% 0; }
                  100% { background-position: 200% 0; }
                }
              `}</style>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center space-x-2 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          
          {/* Hebrew Alphabet Reference */}
          <div className="mt-6 border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-500">Hebrew Alphabet Reference</h3>
              <div className="flex items-center space-x-2 text-gray-400">
                <span className="text-xs hidden sm:inline">Scroll</span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => scrollAlphabet('left')}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => scrollAlphabet('right')}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto relative">
              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-white to-transparent w-8 z-10 pointer-events-none" />
              <div 
                ref={alphabetContainerRef} 
                className="flex gap-4 pb-2 overflow-x-auto scroll-smooth hide-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {hebrewAlphabet.map((letter) => (
                  <div
                    key={letter.hebrew}
                    className="flex-none bg-gray-50 rounded-lg p-3 w-36 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => setSelectedLetter(letter)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold">{letter.hebrew}</span>
                      {letter.pictograph && (
                        <span className="text-xl">{letter.pictograph}</span>
                      )}
                    </div>
                    <div className="text-sm font-medium text-gray-900">{letter.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {letter.transliteration && `(${letter.transliteration})`}
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute inset-y-0 right-0 bg-gradient-to-l from-white to-transparent w-8 z-10 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Translation Results (Share Card Style by Default) */}
        {hebrewText && (
          <div className="mt-8 flex flex-col items-center">
            <h3 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wider text-center w-full max-w-[400px]">Translation Result</h3>
            
            <div
              ref={shareCardRef}
              className="bg-white p-0 rounded-2xl overflow-hidden shadow-2xl border border-gray-100 w-full max-w-[400px]"
            >
              {/* Visual Header */}
              <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-8 text-white text-center relative overflow-hidden" data-share-header>
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none transform -rotate-12 translate-y-4">
                  <span className="text-[120px] font-bold">א ב ג</span>
                </div>
                <Type className="h-12 w-12 mx-auto mb-4 opacity-90" />
                <h2 className="text-3xl font-bold tracking-tight">HebrewLens</h2>
                <p className="text-indigo-100 text-sm mt-1 opacity-80 uppercase tracking-widest">Ancient Wisdom Revealed</p>
              </div>
              
              <div className="p-8 space-y-8 bg-white">
                <div className="text-center">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Original Text</h3>
                  <p className="text-2xl font-medium text-gray-800 italic">"{inputText}"</p>
                </div>
                
                <div className="text-center bg-gray-50 rounded-2xl p-6 py-8 border border-gray-100">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Hebrew Translation</h3>
                  <p className="text-5xl font-bold text-indigo-900 leading-tight" dir="rtl">{hebrewText}</p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Letter Analysis</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {analyzedText.slice(0, 4).map((letter, index) => (
                      <div key={index} className="bg-indigo-50 bg-opacity-50 rounded-xl p-3 border border-indigo-100/50">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-2xl font-bold text-indigo-700">{letter.hebrew}</span>
                          {letter.pictograph && (
                            <span className="text-xl">{letter.pictograph}</span>
                          )}
                        </div>
                        <span className="text-xs font-bold text-indigo-900/70 block uppercase tracking-tighter">{letter.name}</span>
                        <span className="text-[10px] text-indigo-800/60 block leading-tight">{letter.meaning}</span>
                      </div>
                    ))}
                  </div>
                  {analyzedText.length > 4 && (
                    <p className="text-[10px] text-gray-400 text-center italic mt-2">+ {analyzedText.length - 4} more letters analyzed</p>
                  )}
                </div>
              </div>
              
              <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
                <span className="text-xs font-bold text-gray-500">hebrewlens.com</span>
              </div>
            </div>

            <div className="mt-8 flex justify-center w-full max-w-[400px]">
              <button
                onClick={handleDownloadRequest}
                className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-4 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg font-bold text-lg"
              >
                <Download className="h-6 w-6" />
                <span>Save Image</span>
              </button>
            </div>
          </div>
        )}

        <div className="relative">
          {showGuide && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Guide to Using HebrewLens</h3>
                  <button
                    onClick={() => setShowGuide(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-semibold text-indigo-600 mb-2">Tips for Better Results</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-2">
                      <li>Use simple English words and phrases</li>
                      <li>Check the letter analysis for deeper understanding</li>
                      <li>Review common words to improve comprehension</li>
                      <li>Use the search feature to explore specific letters</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-base font-semibold text-indigo-600 mb-2">Sharing Translations</h4>
                    <p className="text-sm text-gray-600">
                      After translation, use the "Share Translation" button to generate a beautiful image of your translation, perfect for sharing on social media or saving for later reference.
                    </p>
                  </div>
                </div>

                <button
                  className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                  onClick={() => setShowGuide(false)}
                >
                  Got it!
                </button>
              </div>
            </div>
          )}
        </div>

        {showDonation && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 my-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Support HebrewLens</h3>
                <button
                  onClick={() => setShowDonation(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="text-center">
                <div className="bg-rose-50 rounded-lg p-3 sm:p-4">
                  <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-rose-600 mx-auto mb-2" />
                  <h4 className="text-base font-semibold text-gray-900 mb-2">
                    {pendingDownload ? 'Support Before You Save' : 'Support Our Mission'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {pendingDownload
                      ? 'HebrewLens is 100% free to use. If this translation was helpful, please consider donating to support the platform before saving your image.'
                      : 'Help us continue providing and improving HebrewLens as a free resource for learning and understanding Hebrew.'}
                  </p>
                </div>

                <div className="flex justify-center gap-4 mt-6 mb-6">
                  <button
                    onClick={() => setDonationType('bitcoin')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      donationType === 'bitcoin'
                        ? 'bg-[#F7931A] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Bitcoin className="h-5 w-5" />
                    <span>Bitcoin</span>
                  </button>
                  <button
                    onClick={() => setDonationType('crypto')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      donationType === 'crypto'
                        ? 'bg-[#0052FF] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Wallet className="h-5 w-5" />
                    <span>Crypto</span>
                  </button>
                  <button
                    onClick={() => setDonationType('cash')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      donationType === 'cash'
                        ? 'bg-[#00D632] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <CreditCard className="h-5 w-5" />
                    <span>Cash</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {donationType === 'bitcoin' ? (
                    <div className="space-y-3">
                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4">
                        <Bitcoin className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                        <div className="space-y-3">
                          <a
                            href="https://mempool.space/address/bc1qaavapz3x3z7necw3l25as2ey0ttac4wdwdhp6e"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-[#F7931A] text-white rounded-lg py-2 px-4 flex items-center justify-center space-x-2 hover:bg-[#E07F1C] transition-colors"
                          >
                            <Bitcoin className="h-5 w-5" />
                            <span>On-chain</span>
                          </a>

                          <a
                            href="https://getalby.com/p/cmpgfb"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-[#792EE5] text-white rounded-lg py-2 px-4 flex items-center justify-center space-x-2 hover:bg-[#6929CC] transition-colors"
                          >
                            <Zap className="h-5 w-5" />
                            <span>Lightning Network</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : donationType === 'crypto' ? (
                    <div className="space-y-3">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
                        <Wallet className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                        <div className="space-y-3">
                          <a
                            href="https://commerce.coinbase.com/pay/d1e2cac8-7d50-4d49-9b34-68ccf20d49a2"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-[#0052FF] text-white rounded-lg py-2 px-4 flex items-center justify-center space-x-2 hover:bg-[#0041CC] transition-colors"
                          >
                            <Wallet className="h-5 w-5" />
                            <span>Pay with Crypto</span>
                          </a>
                        </div>
                        <p className="text-xs text-gray-600 mt-2 text-center">
                          Supports Bitcoin, Ethereum, and other cryptocurrencies
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
                        <Banknote className="h-8 w-8 text-green-500 mx-auto mb-3" />
                        <div className="space-y-3">
                          <a
                            href="https://cash.app/$CMPGFB"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-[#00D632] text-white rounded-lg py-2 px-4 flex items-center justify-center space-x-2 hover:bg-[#00C02E] transition-colors"
                          >
                            <Wallet className="h-5 w-5" />
                            <span>Cash App</span>
                          </a>

                          <a
                            href="https://www.paypal.com/donate/?hosted_button_id=AEMQS6X4BNCH8"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-[#0070BA] text-white rounded-lg py-2 px-4 flex items-center justify-center space-x-2 hover:bg-[#005ea6] transition-colors"
                          >
                            <Wallet className="h-5 w-5" />
                            <span>PayPal</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {pendingDownload && (
                  <div className="mt-8 border-t border-gray-100 pt-6">
                    <button
                      onClick={triggerDownload}
                      className="text-gray-500 hover:text-gray-800 text-sm font-medium underline transition-colors"
                    >
                      Skip & Download Image
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Messiah Section */}
        <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-3xl shadow-sm border border-indigo-100/50 overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-indigo-950 mb-4" dir="rtl">
                ישוע: המשיח המובטח וקיום התורה
              </h2>
              <h3 className="text-2xl md:text-3xl font-semibold text-indigo-800 opacity-90">
                Yeshua: The Promised Messiah and Fulfillment of the Law
              </h3>
              <div className="h-1.5 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-8 rounded-full" />
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Hebrew Content */}
              <div className="space-y-6" dir="rtl">
                <div className="flex items-center space-x-2 space-x-reverse mb-4">
                  <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">עב</span>
                  <h4 className="text-xl font-bold text-indigo-900">אודות המשיח</h4>
                </div>
                <p className="text-lg leading-relaxed text-gray-800">
                  האם שמעת על ישוע (Yeshua)? רבים מאמינים שהוא המשיח המובטח בנביאים. לאורך התנ"ך, אלוהים הבטיח לשלוח גואל שיביא שלום וסליחה. ישוע לא בא להקים דת חדשה, אלא למלא את הבטחות אלוהים לעם ישראל ולעולם כולו.
                </p>
                <p className="text-lg leading-relaxed text-gray-800">
                  בנוסף, ישוע אמר שהוא לא בא לבטל את התורה, אלא לקיים אותה. לאורך ההיסטוריה, אף אחד לא יכול היה לשמור את מצוות התורה באופן מושלם, אך ישוע קיים כל מצווה ומצווה בטוהר ובקדושה. במותו ותחייתו, הוא הפך לקורבן האחרון והמושלם עבור חטאינו, כפי שחזו הנביאים. דרך אמונה בו, אנו חווים את ברית אלוהים החדשה והצודקת, שבה התורה נכתבת על לבנו.
                </p>
              </div>

              {/* English Content */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white text-xs font-bold">EN</span>
                  <h4 className="text-xl font-bold text-indigo-900">About the Messiah</h4>
                </div>
                <p className="text-lg leading-relaxed text-gray-800">
                  Have you heard of Yeshua? Many believe He is the Messiah promised by the prophets. Throughout the Tanakh, God promised to send a Redeemer who would bring peace and forgiveness. Yeshua did not come to start a new religion, but to fulfill God's promises to the people of Israel and the entire world.
                </p>
                <p className="text-lg leading-relaxed text-gray-800">
                  Furthermore, Yeshua said that He did not come to abolish the Torah, but to fulfill it. Throughout history, no one could keep the commandments of the Law perfectly, but Yeshua fulfilled every single commandment in purity and holiness. In His death and resurrection, He became the final and perfect sacrifice for our sins, as the prophets foretold. Through faith in Him, we experience God’s new and righteous covenant, where the Law is written upon our hearts.
                </p>
              </div>
            </div>

            {/* Resources */}
            <div className="mt-16 pt-12 border-t border-indigo-100">
              <h5 className="text-center text-sm font-bold text-indigo-400 uppercase tracking-widest mb-8">
                Resources for Further Study | מקורות ללימוד נוסף
              </h5>
              <div className="grid sm:grid-cols-3 gap-4 max-w-5xl mx-auto">
                <a 
                  href="https://www.gotquestions.org/Jewish-Christian.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group bg-white p-4 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all flex items-start space-x-3"
                >
                  <Info className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600">Jewish-Christian Identity</span>
                </a>
                <a 
                  href="https://www.compellingtruth.org/Jewish-Christian.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group bg-white p-4 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all flex items-start space-x-3"
                >
                  <Book className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600">Judaism and the Gospel</span>
                </a>
                <a 
                  href="https://www.gotquestions.org/is-Jesus-the-Messiah.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group bg-white p-4 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all flex items-start space-x-3"
                >
                  <CheckCircle className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600">Evidence for Yeshua</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>


      <footer className="bg-white shadow-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600 text-sm">
            HebrewLens © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;