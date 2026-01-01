
import { GoogleGenAI, Type } from "@google/genai";
import { FinancialData, MonthlyRecord } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateFinancialData = async (): Promise<FinancialData> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a realistic 12-month financial dataset for a community fund in Pakistan (values in PKR) starting from January. 
    The fund consists of roughly 5-10 friends. 
    Monthly contributions should vary between 50,000 and 250,000 PKR. 
    Monthly distributions to people in need should vary between 30,000 and 200,000 PKR.
    Ensure some months have higher contributions (like Ramadan/Eid/Wedding seasons) and some months have higher distributions (like flood relief or winter support).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          records: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                month: { type: Type.STRING },
                contributorNames: { type: Type.ARRAY, items: { type: Type.STRING } },
                amountCollected: { type: Type.NUMBER },
                amountGiven: { type: Type.NUMBER }
              },
              required: ["month", "contributorNames", "amountCollected", "amountGiven"]
            }
          }
        },
        required: ["records"]
      }
    }
  });

  const rawData = JSON.parse(response.text);
  let cumulative = 0;
  const contributorsSet = new Set<string>();

  const records: MonthlyRecord[] = rawData.records.map((r: any) => {
    const remaining = r.amountCollected - r.amountGiven;
    cumulative += remaining;
    r.contributorNames.forEach((name: string) => contributorsSet.add(name));
    
    return {
      ...r,
      remainingBalance: remaining,
      cumulativeBalance: cumulative
    };
  });

  const totalCollected = records.reduce((sum, r) => sum + r.amountCollected, 0);
  const totalDistributed = records.reduce((sum, r) => sum + r.amountGiven, 0);

  return {
    records,
    summary: {
      totalCollected,
      totalDistributed,
      finalBalance: cumulative,
      uniqueContributors: contributorsSet.size
    }
  };
};
