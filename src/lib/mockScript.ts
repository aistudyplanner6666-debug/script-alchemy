export type Mood = "Dramatic" | "Action" | "Comedy" | "Romantic" | "Tragic";

export interface Character {
  name: string;
  role: string;
  description: string;
}
export interface Dialogue {
  character: string;
  line: string;
}
export interface Scene {
  number: number;
  title: string;
  description: string;
  dialogues: Dialogue[];
}
export interface Script {
  title: string;
  tagline: string;
  mood: Mood;
  situation: string;
  characters: Character[];
  scenes: Scene[];
  createdAt: number;
  id: string;
}

const TITLES: Record<Mood, string[]> = {
  Dramatic: ["Jab Tak Tum Ho", "Adhuri Kahaani", "Saaya"],
  Action: ["Sher Ka Vaar", "Toofan", "Aag Ka Dariya"],
  Comedy: ["Bilkul Pagal", "Chhota Sa Drama", "Hadd Hai!"],
  Romantic: ["Tum Mile", "Ishq Ki Baarish", "Dil Ka Sauda"],
  Tragic: ["Khamoshi", "Adhoora Sapna", "Aansoo"],
};

const TAGLINES: Record<Mood, string[]> = {
  Dramatic: ["Har lamha ek toofan hai…", "Jab kismat ne li karwat…"],
  Action: ["Ek aadmi. Ek mission. Ek tabaahi.", "Aag se khelne ka waqt aa gaya…"],
  Comedy: ["Hasi rok lo… agar rok sako!", "Pagalpan ka naya level."],
  Romantic: ["Do dil, ek dhadkan, anginat sapne…", "Pyaar mein sab jaayaz hai."],
  Tragic: ["Kuch kahaaniyaan adhoori reh jaati hain…", "Yaadein… bas yaadein."],
};

export function generateMockScript(situation: string, mood: Mood): Script {
  const title = TITLES[mood][Math.floor(Math.random() * TITLES[mood].length)];
  const tagline = TAGLINES[mood][Math.floor(Math.random() * TAGLINES[mood].length)];

  const characters: Character[] = [
    { name: "Aarav Khanna", role: "The Protagonist", description: "A brooding architect haunted by a past he refuses to face." },
    { name: "Meera Rao", role: "The Heart", description: "A free-spirited journalist with a razor wit and a stubborn streak." },
    { name: "Vikram Saxena", role: "The Antagonist", description: "Old money, older grudges. Smiles when he means war." },
    { name: "Dadi Sahiba", role: "The Conscience", description: "Knows every secret in town and bakes the best halwa." },
  ];

  const base = situation.trim() || "A chance encounter at a Mumbai monsoon café";

  const scenes: Scene[] = [
    {
      number: 1,
      title: "The Encounter",
      description: `Rain drums on the windows of a forgotten Bandra café. ${base}. The world slows.`,
      dialogues: [
        { character: "Aarav", line: "Tum yahaan? Is shehar mein, is baarish mein?" },
        { character: "Meera", line: "Main toh hamesha yahaan thi. Tumne dekha nahi." },
      ],
    },
    {
      number: 2,
      title: "The Confrontation",
      description: "Vikram arrives uninvited. The temperature drops. Old wounds reopen in candlelight.",
      dialogues: [
        { character: "Vikram", line: "Aarav… kuch cheezein waqt ke saath dafna deni chahiye." },
        { character: "Aarav", line: "Aur kuch cheezein… waqt se pehle khatam karni chahiye." },
        { character: "Meera", line: "Bas! Aaj sach saamne aayega." },
      ],
    },
    {
      number: 3,
      title: "The Revelation",
      description: "Under a sky lit by Diwali fireworks, Dadi Sahiba reveals the truth that changes everything.",
      dialogues: [
        { character: "Dadi", line: "Beta, jo tumne khoya tha… woh kabhi gaya hi nahi tha." },
        { character: "Meera", line: "Toh phir hum kya the? Ek galti? Ek kahaani?" },
        { character: "Aarav", line: "Hum… ek shuruaat the. Aaj bhi hain." },
      ],
    },
    {
      number: 4,
      title: "The Finale",
      description: `A ${mood.toLowerCase()} crescendo. The frame freezes. The audience exhales.`,
      dialogues: [
        { character: "Aarav", line: "Agar yeh kahaani hai, toh iska end main likhunga." },
        { character: "Meera", line: "Aur agar yeh zindagi hai… toh hum dono milke." },
      ],
    },
  ];

  return {
    id: crypto.randomUUID(),
    title,
    tagline,
    mood,
    situation: base,
    characters,
    scenes,
    createdAt: Date.now(),
  };
}
