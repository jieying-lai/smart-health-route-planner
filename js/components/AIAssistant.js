window.App = window.App || {};

window.App.AIAssistant = class AIAssistant {
    constructor() {
        this.state = 'happy';
        this.element = null;
        this.chatVisible = false;
        this.clickTimer = null;
        this.idleTimer = null;
        this.init();
    }

    init() {
        this.element = document.createElement('div');
        this.element.id = 'ai-assistant';
        this.element.className = 'ai-assistant floating';

        // Robot Character & Chat HTML
        this.element.innerHTML = `
            <div class="robot-container">
                <div class="robot-head">
                    <div class="robot-antenna"></div>
                    <div class="robot-face">
                        <div class="eye left"></div>
                        <div class="eye right"></div>
                    </div>
                </div>
                <div class="robot-body"></div>
            </div>
            
            <!-- Chat Interface -->
            <div class="assistant-chat" id="assistant-chat">
                <div class="chat-header" style="padding-bottom: 10px; border-bottom: 1px solid #eee; margin-bottom: 10px; font-weight: bold; color: var(--primary-color);">
                    🤖 Little Assistant
                </div>
                <div class="chat-messages" id="chat-messages">
                    <div class="chat-msg ai">Hi! I'm your travel buddy. Ask me about weather, pollution, or just say hi! 👋</div>
                </div>
                <div class="chat-input-area">
                    <input type="text" class="chat-input" id="chat-input" placeholder="Type here..." />
                    <button class="chat-send" id="chat-send">➤</button>
                </div>
            </div>
        `;

        document.body.appendChild(this.element);

        // Interactions
        const robot = this.element.querySelector('.robot-container');

        // Double Click to Chat
        robot.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            if (this.clickTimer) clearTimeout(this.clickTimer);
            this.toggleChat();
            this.react('happy');
        });

        // Single Click to React
        robot.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.clickTimer) clearTimeout(this.clickTimer);
            this.clickTimer = setTimeout(() => {
                if (!this.chatVisible) {
                    this.react('love');
                    this.say("I like you! Double-click to chat.");
                }
            }, 250);
        });

        // Hover Effect
        robot.addEventListener('mouseover', () => {
            if (!this.chatVisible) this.react('happy');
            this.resetIdleTimer();
        });

        // Chat Logic
        const sendBtn = this.element.querySelector('#chat-send');
        const input = this.element.querySelector('#chat-input');

        const sendMessage = () => {
            const text = input.value.trim();
            if (text) {
                this.addMessage(text, 'user');
                input.value = '';
                this.processQuery(text);
            }
        };

        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        // Close chat when clicking outside
        document.addEventListener('click', (e) => {
            if (this.chatVisible && !this.element.contains(e.target)) {
                this.toggleChat(false);
            }
        });

        // Start Life Cycle
        this.startBlinking();
        this.resetIdleTimer();
    }

    startBlinking() {
        setInterval(() => {
            if (['happy', 'neutral', 'calm'].includes(this.state)) {
                const eyes = this.element.querySelectorAll('.eye');
                eyes.forEach(eye => eye.classList.add('blink'));
                setTimeout(() => {
                    eyes.forEach(eye => eye.classList.remove('blink'));
                }, 200);
            }
        }, 4000);
    }

    resetIdleTimer() {
        if (this.idleTimer) clearTimeout(this.idleTimer);
        this.idleTimer = setTimeout(() => {
            if (!this.chatVisible) {
                this.react('sleepy');
                this.say("Zzz...", 2000);
            }
        }, 15000); // Sleep after 15s idle
    }

    toggleChat(forceState) {
        this.chatVisible = forceState !== undefined ? forceState : !this.chatVisible;
        const chat = this.element.querySelector('#assistant-chat');
        if (this.chatVisible) {
            chat.classList.add('visible');
            this.element.querySelector('#chat-input').focus();
            this.react('happy');
            this.resetIdleTimer();
        } else {
            chat.classList.remove('visible');
            this.react('neutral');
        }
    }

    addMessage(text, sender) {
        const container = this.element.querySelector('#chat-messages');
        const msg = document.createElement('div');
        msg.className = `chat-msg ${sender}`;
        msg.textContent = text;
        container.appendChild(msg);
        container.scrollTop = container.scrollHeight;
    }

    // --- JAMAI BRAIN (AI Chat) ---
    async processQuery(text) {
        // 1. Set Thinking State
        this.react('confused'); // Looks like thinking

        try {
            // JamAI Configuration
            const projectId = 'proj_8074cdfcfe8657ff8d03b1e8';
            const apiKey = 'jamai_pat_fcc821f53ee8e94560c4ea16f6f522702ad1fa959344d576';
            const url = `https://api.jamaibase.com/api/v1/chat/completions`;

            // --- CONTEXT ENRICHMENT ---
            let contextInfo = "";
            const lowerText = text.toLowerCase();

            // Check for weather queries
            if (/weather|rain|hot|cold|temperature|sunny|cloudy/.test(lowerText)) {
                try {
                    let location = null;
                    // Extract city name if mentioned (e.g., "weather in KLCC")
                    const cityMatch = text.match(/(?:in|at|for)\s+([A-Za-z\s]+)/i);
                    if (cityMatch) {
                        location = await window.DataService.geocode(cityMatch[1].trim());
                    } else {
                        const coords = await window.getLocation();
                        location = { lat: coords.lat, lon: coords.lon, name: "your location" };
                    }

                    if (location) {
                        const weather = await window.DataService.getWeather(location.lat, location.lon);
                        if (weather) {
                            contextInfo += `Weather at ${location.name}: ${weather.temp}°C, ${weather.desc}, Humidity: ${weather.humidity}%, Wind: ${weather.wind} km/h. `;
                            // Add warm reminders
                            if (weather.temp > 30) contextInfo += "Remind user to drink water and stay hydrated. ";
                            if (weather.desc.toLowerCase().includes('rain')) contextInfo += "Remind user to drive safe and bring an umbrella. ";
                        }
                    }
                } catch (e) {
                    console.warn("Weather context failed:", e);
                }
            }

            // Check for pollution queries
            if (/pollution|air|haze|aqi|quality/.test(lowerText)) {
                try {
                    let location = null;
                    const cityMatch = text.match(/(?:in|at|for)\s+([A-Za-z\s]+)/i);
                    if (cityMatch) {
                        location = await window.DataService.geocode(cityMatch[1].trim());
                    } else {
                        const coords = await window.getLocation();
                        location = { lat: coords.lat, lon: coords.lon, name: "your location" };
                    }

                    if (location) {
                        const pollution = await window.DataService.getPollution(location.lat, location.lon);
                        if (pollution) {
                            contextInfo += `Air Quality at ${location.name}: AQI ${pollution.aqi} (${pollution.status}). `;
                            if (pollution.aqi > 100) contextInfo += "Remind user to wear a mask when going outside. ";
                        }
                    }
                } catch (e) {
                    console.warn("Pollution context failed:", e);
                }
            }

            // Check for hospital/sick queries
            if (/sick|hospital|clinic|doctor|emergency|hurt|pain|ill/.test(lowerText)) {
                try {
                    const coords = await window.getLocation();
                    const hospitals = await window.DataService.getHospitals(coords.lat, coords.lon);
                    if (hospitals) {
                        contextInfo += `Nearby hospitals: ${hospitals}. `;
                    }
                } catch (e) {
                    console.warn("Hospital context failed:", e);
                }
            }

            const systemPrompt = contextInfo
                ? `You are a helpful, expressive robot assistant for a AWhere? app. Keep answers short (max 2 sentences). You can control your face by ending your response with a mood tag like [happy], [sad], [love], [angry], [cool], [surprised], [sleepy], [wink]. Default is [neutral]. CONTEXT: ${contextInfo}`
                : "You are a helpful, expressive robot assistant for a AWhere? app. Keep answers short (max 2 sentences). You can control your face by ending your response with a mood tag like [happy], [sad], [love], [angry], [cool], [surprised], [sleepy], [wink]. Default is [neutral]. Example: 'Hello! [happy]'";

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'X-Project-ID': projectId
                },
                body: JSON.stringify({
                    model: "ellm/gemini-2.5-flash",
                    messages: [
                        {
                            role: "system",
                            content: systemPrompt
                        },
                        {
                            role: "user",
                            content: text
                        }
                    ],
                    max_tokens: 150,
                    temperature: 0.7
                })
            });

            if (!response.ok) throw new Error(`JamAI API Error: ${response.status}`);

            const data = await response.json();
            let content = data.choices[0].message.content;

            // Extract Mood
            let mood = 'happy';
            const moodMatch = content.match(/\[(happy|sad|love|angry|cool|surprised|sleepy|wink|neutral|confused|dead|cry|smile|sleep)\]/i);

            if (moodMatch) {
                mood = moodMatch[1].toLowerCase();
                content = content.replace(moodMatch[0], '').trim();
            }

            this.addMessage(content, 'ai');
            this.react(mood);

        } catch (error) {
            console.warn("AI Chat failed, using fallback:", error);
            // DEBUG: Show error to user to help debug
            this.addMessage(`DEBUG ERROR: ${error.message}`, 'ai');
            this.processRuleBasedQuery(text);
        }
    }

    // --- LOCAL BRAIN (Fallback Rule-Based Chat) ---
    processRuleBasedQuery(text) {
        const lowerText = text.toLowerCase();
        let response = "I'm not sure about that, but I'm learning! 🤖";
        let mood = 'neutral';

        // 1. Greetings
        if (/hi|hello|hey|greetings/i.test(lowerText)) {
            const greetings = ["Hello! 👋", "Hi there! 🌟", "Beep boop! Greetings! 🤖"];
            response = greetings[Math.floor(Math.random() * greetings.length)];
            mood = 'happy';
        }
        // 2. Emotions
        else if (/sad|unhappy|cry|depressed/i.test(lowerText)) {
            response = "Oh no! Don't be sad. I'm here for you! 💙 Here is a flower: 🌻";
            mood = 'love';
        }
        else if (/happy|good|great|awesome/i.test(lowerText)) {
            response = "Yay! I'm happy that you're happy! 🎉";
            mood = 'excited';
        }
        else if (/angry|mad|hate/i.test(lowerText)) {
            response = "Whoa, take a deep breath! 🌬️ It will be okay.";
            mood = 'concerned';
        }
        else if (/love|like you|cute/i.test(lowerText)) {
            response = "Aww, you're making my circuits blush! ❤️";
            mood = 'love';
        }
        // 3. App Context
        else if (/weather|rain|hot|cold/i.test(lowerText)) {
            response = "You can check the detailed forecast in the Weather tab! ⛅";
            mood = 'happy';
        }
        else if (/pollution|air|haze/i.test(lowerText)) {
            response = "Check the Pollution Map for real-time air quality updates! 😷";
            mood = 'concerned';
        }
        else if (/route|map|go|travel/i.test(lowerText)) {
            response = "I can help you find the best route! Just go to the Route tab. 🗺️";
            mood = 'excited';
        }
        // 4. Fun
        else if (/joke|funny/i.test(lowerText)) {
            const jokes = [
                "Why did the robot go on a diet? He had too many bytes! 😂",
                "What is a robot's favorite music? Heavy metal! 🎸",
                "Why was the computer cold? It left its Windows open! ❄️"
            ];
            response = jokes[Math.floor(Math.random() * jokes.length)];
            mood = 'happy';
        }
        // 5. New Emotions
        else if (/wow|omg|amazing/i.test(lowerText)) {
            response = "I know right?! 😲";
            mood = 'surprised';
        }
        else if (/confused|what|huh/i.test(lowerText)) {
            response = "Hmm, let me think about that... 🤔";
            mood = 'confused';
        }
        else if (/dead|kill|die/i.test(lowerText)) {
            response = "System Error! Just kidding. 😵";
            mood = 'dead';
        }
        else if (/cool|swag|style/i.test(lowerText)) {
            response = "Stay cool! 😎";
            mood = 'cool';
        }
        else if (/wink/i.test(lowerText)) {
            response = "*Winks back* 😉";
            mood = 'wink';
        }
        else if (/cry|tears|sadness/i.test(lowerText)) {
            response = "It's okay to cry sometimes. 😢";
            mood = 'cry';
        }
        else if (/smile|cheese/i.test(lowerText)) {
            response = "Cheese! 😁";
            mood = 'smile';
        }
        else if (/sleep|tired|nap/i.test(lowerText)) {
            response = "I'm getting sleepy too... 😴";
            mood = 'sleep';
        }

        // Simulate "Thinking" delay
        setTimeout(() => {
            this.addMessage(response, 'ai');
            this.react(mood);
        }, 600);
    }

    setMood(mood) {
        this.react(mood);
    }

    react(mood) {
        this.state = mood;
        const eyes = this.element.querySelectorAll('.eye');
        const head = this.element.querySelector('.robot-head');

        this.element.classList.remove('floating');
        void this.element.offsetWidth; // Trigger reflow

        // Reset
        eyes.forEach(eye => {
            eye.className = 'eye';
            eye.innerHTML = '';
            eye.style = '';
        });
        head.classList.remove('shake');

        // Apply Mood
        if (mood === 'love') {
            this.element.classList.add('bounce');
            eyes.forEach(eye => {
                eye.classList.add('love');
                eye.innerHTML = '❤️';
            });
        }
        else if (mood === 'excited') {
            this.element.classList.add('bounce');
            eyes.forEach(eye => {
                eye.classList.add('happy');
                eye.innerHTML = '⭐';
            });
        }
        else if (mood === 'angry') {
            head.classList.add('shake');
            eyes.forEach(eye => eye.classList.add('angry'));
        }
        else if (mood === 'happy') {
            this.element.classList.add('bounce');
            eyes.forEach(eye => eye.classList.add('happy'));
        }
        else if (mood === 'concerned' || mood === 'worried') {
            eyes.forEach(eye => {
                eye.style.height = '6px';
                eye.style.background = '#3B82F6';
                eye.style.transform = 'rotate(-10deg)';
                if (eye.classList.contains('right')) eye.style.transform = 'rotate(10deg)';
            });
        }
        else if (mood === 'sleepy') {
            eyes.forEach(eye => {
                eye.style.height = '2px';
                eye.style.width = '12px';
            });
        }
        else if (mood === 'surprised') {
            eyes.forEach(eye => eye.classList.add('surprised'));
        }
        else if (mood === 'confused') {
            eyes.forEach(eye => eye.classList.add('confused'));
        }
        else if (mood === 'dead') {
            eyes.forEach(eye => {
                eye.classList.add('dead');
                eye.innerHTML = 'X';
            });
        }
        else if (mood === 'cool') {
            eyes.forEach(eye => eye.classList.add('cool'));
        }
        else if (mood === 'wink') {
            const leftEye = this.element.querySelector('.eye.left');
            leftEye.classList.add('wink');
        }
        else if (mood === 'cry') {
            eyes.forEach(eye => eye.classList.add('cry'));
        }
        else if (mood === 'smile') {
            eyes.forEach(eye => eye.classList.add('smile'));
        }
        else if (mood === 'sleep') {
            eyes.forEach(eye => eye.classList.add('sleep'));
        }

        // Return to floating
        setTimeout(() => {
            this.element.classList.remove('bounce');
            head.classList.remove('shake');
            this.element.classList.add('floating');

            // Reset transient moods
            if (['love', 'excited', 'angry', 'surprised', 'confused', 'dead', 'cool', 'wink', 'cry', 'smile'].includes(mood)) {
                setTimeout(() => {
                    this.state = 'neutral';
                    eyes.forEach(eye => {
                        eye.className = 'eye';
                        eye.innerHTML = '';
                        eye.style = '';
                    });
                }, 3000);
            }
        }, 2000);
    }

    say(text, duration = 3000) {
        if (this.chatVisible) {
            this.addMessage(text, 'ai');
            return;
        }

        let bubble = this.element.querySelector('.temp-bubble');
        if (!bubble) {
            bubble = document.createElement('div');
            bubble.className = 'assistant-message visible temp-bubble';
            this.element.appendChild(bubble);
        }

        bubble.textContent = text;
        bubble.classList.add('visible');

        setTimeout(() => {
            bubble.classList.remove('visible');
            setTimeout(() => bubble.remove(), 300);
        }, duration);
    }
};
