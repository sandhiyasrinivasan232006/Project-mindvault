import { Message } from "../store/useMindVaultStore";

interface AnalysisResult {
  moodScore: number;
  moodName: string;
  stress: number;
  energy: number;
  focus: number;
  burnoutLevel: "Low" | "Moderate" | "High";
  primaryEmotion: string;
  tags: string[];
  advice: string;
}

// Client-side local dictionary and rule engine for instant empathetic recovery advice
export function analyzeTextLocally(text: string): AnalysisResult {
  const lowercase = text.toLowerCase();
  
  // Keyword dictionaries
  const markers = {
    stress: ["stressed", "anxious", "overwhelm", "worry", "panic", "tight", "scared", "fear", "pressure", "deadline"],
    exhaustion: ["tired", "exhausted", "burnout", "sleepy", "drained", "fatigue", "no energy", "heavy", "worn out"],
    peace: ["calm", "peaceful", "relaxed", "tranquil", "serene", "meditative", "mindful", "quiet", "still", "content"],
    inspiration: ["inspired", "excited", "happy", "joy", "creative", "passionate", "determined", "grateful", "hopeful", "motivated"],
    sadness: ["sad", "lonely", "depressed", "heavy heart", "crying", "lost", "grief", "empty", "hurting", "blue"],
    focus: ["focused", "productive", "clear", "sharp", "flow", "concentration", "learning", "alert"]
  };

  // Count matches
  const scores = {
    stress: 0,
    exhaustion: 0,
    peace: 0,
    inspiration: 0,
    sadness: 0,
    focus: 0
  };

  Object.entries(markers).forEach(([key, list]) => {
    list.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'g');
      const matches = lowercase.match(regex);
      if (matches) {
        scores[key as keyof typeof scores] += matches.length;
      }
    });
  });

  // Calculate profile metrics
  let stress = 3 + (scores.stress * 2) + (scores.sadness * 1) - (scores.peace * 2);
  let energy = 5 + (scores.inspiration * 2) + (scores.focus * 1) - (scores.exhaustion * 2) - (scores.sadness * 1);
  let focus = 5 + (scores.focus * 2) + (scores.peace * 1) - (scores.stress * 1) - (scores.exhaustion * 1.5);
  
  // Clamping
  stress = Math.max(1, Math.min(10, Math.round(stress)));
  energy = Math.max(1, Math.min(10, Math.round(energy)));
  focus = Math.max(1, Math.min(10, Math.round(focus)));

  // Mood scoring calculation
  let moodScore = 5 + (scores.peace * 1.5) + (scores.inspiration * 1.5) - (scores.stress * 1.2) - (scores.sadness * 1.5) - (scores.exhaustion * 0.8);
  moodScore = Math.max(1, Math.min(10, Math.round(moodScore)));

  // Identify dominant emotion and tags
  let primaryEmotion = "Neutral";
  const tags: string[] = [];

  const maxCategory = Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b);
  if (maxCategory[1] > 0) {
    if (maxCategory[0] === "stress") {
      primaryEmotion = "Anxious/Stressed";
      tags.push("Stress Management", "Mindfulness Needed");
    } else if (maxCategory[0] === "exhaustion") {
      primaryEmotion = "Exhausted/Drained";
      tags.push("Burnout Risk", "Energy Restoration");
    } else if (maxCategory[0] === "peace") {
      primaryEmotion = "Calm/Serene";
      tags.push("Inner Peace", "High Resonance");
    } else if (maxCategory[0] === "inspiration") {
      primaryEmotion = "Inspired/Empowered";
      tags.push("High Motivation", "Flow State");
    } else if (maxCategory[0] === "sadness") {
      primaryEmotion = "Sad/Introspective";
      tags.push("Emotional Healing", "Self-Care");
    } else if (maxCategory[0] === "focus") {
      primaryEmotion = "Focused/Productive";
      tags.push("Deep Focus", "Goal Oriented");
    }
  } else {
    tags.push("Daily Check-in");
  }

  // Determine burnout risk
  let burnoutLevel: "Low" | "Moderate" | "High" = "Low";
  if (stress >= 7 || energy <= 3) {
    burnoutLevel = "High";
  } else if (stress >= 5 || energy <= 5) {
    burnoutLevel = "Moderate";
  }

  let moodName = "Neutral";
  if (moodScore >= 8) moodName = "Radiant";
  else if (moodScore >= 6) moodName = "Tranquil";
  else if (moodScore >= 4) moodName = "Grounded";
  else if (moodScore >= 2) moodName = "Restless";
  else moodName = "Heavy";

  // Provide empathetic neuroscience suggestions
  let advice = "";
  if (burnoutLevel === "High") {
    advice = "Your brain signals high hyperarousal and low energy stores. We strongly advise a 5-minute Dopamine Detox, coupled with our 4-7-8 breathing circle to slow your prefrontal activity. Avoid additional caffeine or screen time for the next 90 minutes.";
  } else if (primaryEmotion === "Anxious/Stressed") {
    advice = "Stress response activated. Slow down your heart rate by activating the vagus nerve. Navigate to the Recovery page and start a 3-minute Box Breathing session. Remember that this physical sensation of anxiety is temporary and manageable.";
  } else if (primaryEmotion === "Exhausted/Drained") {
    advice = "Neurotransmitter levels appear depleted. Prioritize a 'Sleep Recovery' binaural beats session. Do not force productivity right now—your system is requesting deep structural rest and physical recovery.";
  } else if (primaryEmotion === "Calm/Serene") {
    advice = "You are in an optimal parasympathetic state. This is an excellent time to commit thoughts to your Gratitude Vault, strengthening neural pathways associated with positive cognitive bias.";
  } else if (primaryEmotion === "Inspired/Empowered") {
    advice = "Dopamine and adrenaline are in productive balance. Channel this high-neuro-resonance state to tackle creative problems or log your future dreams in the Motivation Vault while your vision is highly active.";
  } else if (primaryEmotion === "Sad/Introspective") {
    advice = "It is healthy to hold space for heavier emotions. Journaling this in the Healing Vault allows your brain to externalize and process these feelings. Consider walking or listening to soothing 432Hz ambient recovery audio.";
  } else {
    advice = "You are in a balanced, grounded state. Maintain this cognitive stability by taking a short mindfulness break, drinking water, and taking a single deep breath.";
  }

  return {
    moodScore,
    moodName,
    stress,
    energy,
    focus,
    burnoutLevel,
    primaryEmotion,
    tags,
    advice
  };
}

// Generate companion chatbot replies
export async function generateCompanionResponse(
  history: Message[],
  personality: "empathetic" | "stoic" | "analytical" | "zen",
  apiKey?: string
): Promise<{ text: string; emotion: string }> {
  const lastUserMessage = [...history].reverse().find(m => m.sender === "user")?.text || "";
  const analysis = analyzeTextLocally(lastUserMessage);
  
  // Dynamic color-theme mapping for the ambient dashboard glow based on identified emotion
  let emotion = "calm";
  if (analysis.primaryEmotion === "Anxious/Stressed") emotion = "stressed";
  else if (analysis.primaryEmotion === "Exhausted/Drained") emotion = "exhausted";
  else if (analysis.primaryEmotion === "Inspired/Empowered") emotion = "inspired";
  else if (analysis.primaryEmotion === "Sad/Introspective") emotion = "healing";
  else if (analysis.primaryEmotion === "Focused/Productive") emotion = "focus";

  // If the user has entered an API key, we connect to Gemini Live for full LLM cognitive replies
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const prompt = `
You are the AI emotional companion for "MindVault AI", a premium, futuristic neural-wellness platform.
Your name is Aura. Your designated personality type is: ${personality.toUpperCase()}.

Current Emotional State of the User based on NLP:
- Dominant emotion: ${analysis.primaryEmotion}
- Stress level: ${analysis.stress}/10
- Energy level: ${analysis.energy}/10
- Focus: ${analysis.focus}/10
- Burnout risk: ${analysis.burnoutLevel}

Instructions:
1. Provide a highly empathetic, supportive, and scientifically grounded response to the user's last message.
2. Maintain your personality constraints:
   - "empathetic": deeply warm, validating, supportive, kind.
   - "stoic": resilient, calm, focus on what can be controlled, rational, empowering.
   - "analytical": neuroscience-focused, logical, explaining why the brain feels this way, structured suggestions.
   - "zen": poetic, meditative, spacious, encouraging breathing and being in the present moment.
3. Keep the response concise, engaging, and professional (around 3-4 sentences). Never sound like a generic assistant.
4. End with a subtle prompt or suggestion.

User Message: "${lastUserMessage}"
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              maxOutputTokens: 250,
              temperature: 0.7
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim().length > 0) {
          return { text: text.trim(), emotion };
        }
      }
    } catch (e) {
      console.warn("Gemini connection error, falling back to local engine:", e);
    }
  }

  // Empathetic client-side templates if no API key is specified (Zero cost fallback)
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulating typing latency for premium feeling

  let text = "";
  if (personality === "stoic") {
    if (emotion === "stressed") {
      text = "I hear you. Stress is a natural signal that something matters to you, but remember: you cannot control outer events, only your response to them. Take a slow deep breath, focus fully on the single task right in front of you, and let go of the rest. What is one action you can take right now?";
    } else if (emotion === "exhausted") {
      text = "Exhaustion is your body's rational boundary. Accepting when you need rest is not weakness—it is a strategic requirement for long-term resilience. Give yourself absolute permission to disengage and sleep. What can you take off your plate today?";
    } else if (emotion === "inspired") {
      text = "Excellent focus. This momentum is valuable, but channel it deliberately. Define your primary objective and direct your energy toward execution, avoiding minor distractions. What is the most critical milestone you are focusing on?";
    } else {
      text = "Staying calm and centered is the foundation of mental strength. By maintaining this emotional baseline, you are ready to process whatever challenges arise. How can I help you organize your thoughts today?";
    }
  } else if (personality === "analytical") {
    if (emotion === "stressed") {
      text = `Your stress response has triggered cortisol release and activated your amygdala. This temporarily reduces prefrontal cortex efficiency, which explains any racing thoughts. We can counter this: a 4-7-8 breathing set will engage your vagus nerve to slow down your heart rate. Shall we try a breathing cycle together?`;
    } else if (emotion === "exhausted") {
      text = "Your subjective exhaustion indicates a depleting of critical neurotransmitters like dopamine and cellular ATP. To recover, the cognitive load must be reduced. Resting in a quiet room or listening to 432Hz alpha wave frequencies will promote deep recovery. Let's step back.";
    } else if (emotion === "inspired") {
      text = "I detect a high dopamine spikes and strong prefrontal coherence. This is a rare, highly neuro-resonant state optimal for complex problem-solving and neural plasticity. What specific cognitive breakthroughs are you looking to capture?";
    } else {
      text = "Your metrics show high homeostatic balance. Cortisol levels are stable, and heart rate variability is likely optimal. This cognitive equilibrium is perfect for logging new memories or outlining strategic tasks. What's on your mind?";
    }
  } else if (personality === "zen") {
    if (emotion === "stressed") {
      text = "The storm is loud, but you are the sky, not the clouds. The clouds will pass, leaving the sky untouched. Let's let go of the tension in your shoulders and breathe together. Inhale peace, exhale tension. Let everything else drift away for a moment.";
    } else if (emotion === "exhausted") {
      text = "Like the earth in winter, your spirit is calling for silence and restorative rest. Do not force the flower to bloom when it is time to nourish the roots. Close your eyes, listen to your breathing, and rest. You have done enough.";
    } else if (emotion === "inspired") {
      text = "A beautiful wave of energy is moving through you. Enjoy this warm sunshine in your mind, let it flow freely into your actions. Create without judgment, like a river winding through the stone. What beautiful creations are flowing today?";
    } else {
      text = "In this quiet space, there is nothing to fix, nothing to change. We are simply here, breathing in this present moment. Enjoy this tranquil stillness. What quiet thoughts would you like to reflect on?";
    }
  } else {
    // Empathetic Default personality
    if (emotion === "stressed") {
      text = "I can feel how heavy things are for you right now, and I want you to know it's completely okay to feel overwhelmed. You don't have to figure everything out today. Let's take it one gentle step at a time. Would you like to do a quick 3-minute guided breathing session with me?";
    } else if (emotion === "exhausted") {
      text = "You've been holding up so much for so long, and it's completely natural that you're feeling so drained. Your mind and body are gently asking you to rest. Please give yourself permission to step away from all work. How about we look at some relaxing soundscapes?";
    } else if (emotion === "inspired") {
      text = "That is so wonderful to hear! I'm genuinely excited for you. It sounds like your mind is in a very vibrant and positive space. Let's capture this incredible feeling in your Gratitude Vault so you can always revisit this light. What was the catalyst for this spark?";
    } else if (emotion === "healing") {
      text = "I'm so sorry things are feeling so heavy and painful right now. It takes so much courage to express these deeper feelings. Please be extra kind and gentle to yourself today. I am right here with you to listen and support you. Would you like to write a note in your Healing Vault?";
    } else {
      text = "It sounds like you are feeling calm and centered, which is wonderful. I'm here whenever you need to explore a thought, organize your goals, or simply check in with your mind. How is your energy holding up today?";
    }
  }

  return { text, emotion };
}
