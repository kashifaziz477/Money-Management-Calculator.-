
import { GoogleGenAI, Type } from "@google/genai";
import { FinancialData, MonthlyRecord } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateFinancialData = async (): Promise<FinancialData> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a realistic 12-month financial dataset for a community fund in Pakistan (values in PKR) starting from January. 
    The fund consists of roughly 5-10 friends. 
    Monthly contributions should vary between 50,000 and 250,000 PKR. 
    Monthly distributions should vary between 30,000 and 200,000 PKR.
    For each month, provide a list of distributions with specific recipient names (e.g., "Local School Fee", "Widow Support (Naseem)", "Medical Bill (Aslam)", "Mosque Repair").
    Ensure some months have higher contributions (like Ramadan/Eid/Wedding seasons) and some months have higher distributions.`,
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
                distributions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      recipient: { type: Type.STRING },
                      amount: { type: Type.NUMBER }
                    },
                    required: ["recipient", "amount"]
                  }
                }
              },
              required: ["month", "contributorNames", "amountCollected", "distributions"]
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
    const totalGiven = r.distributions.reduce((sum: number, d: any) => sum + d.amount, 0);
    const remaining = r.amountCollected - totalGiven;
    cumulative += remaining;
    r.contributorNames.forEach((name: string) => contributorsSet.add(name));
    
    return {
      ...r,
      amountGiven: totalGiven,
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
