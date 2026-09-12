window.App = window.App || {};

window.App.Premium = function () {
    const container = document.createElement('div');
    container.className = 'container fade-in';

    container.innerHTML = `
        <div style="text-align: center; margin-bottom: 2.5rem;">
            <span style="background: linear-gradient(135deg, #FFD700, #FFA500); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800; letter-spacing: 3px; font-size: 0.9rem;">PREMIUM</span>
            <h1 style="margin-top: 5px;">Customize Assistant</h1>
        </div>

        <div class="card">
            <h3>AI Skin Analysis</h3>
            <p style="margin-bottom: 1rem;">Let AI analyze your skin to recommend the best assistant look.</p>
            <div style="background: #000; height: 180px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
                <div id="camera-feed" style="color: #666; font-size: 0.9rem;">Camera Feed</div>
                <div id="scan-line" style="position: absolute; top: 0; left: 0; width: 100%; height: 2px; background: #00BFA6; box-shadow: 0 0 15px #00BFA6; display: none;"></div>
            </div>
            <button class="btn btn-primary" style="width: 100%" id="scan-btn">Start Analysis</button>
        </div>

        <div class="card">
            <h3>Assistant Skin</h3>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 15px;">
                <div style="text-align: center; cursor: pointer;">
                    <div style="width: 60px; height: 60px; background: #6C63FF; border-radius: 50%; margin: 0 auto 8px; border: 3px solid white; box-shadow: 0 0 15px rgba(108, 99, 255, 0.5);"></div>
                    <span style="font-size: 0.8rem; font-weight: 600;">Default</span>
                </div>
                <div style="text-align: center; cursor: pointer; opacity: 0.6;">
                    <div style="width: 60px; height: 60px; background: #FF6584; border-radius: 50%; margin: 0 auto 8px;"></div>
                    <span style="font-size: 0.8rem;">Rose</span>
                </div>
                <div style="text-align: center; cursor: pointer; opacity: 0.6;">
                    <div style="width: 60px; height: 60px; background: #00BFA6; border-radius: 50%; margin: 0 auto 8px;"></div>
                    <span style="font-size: 0.8rem;">Teal</span>
                </div>
            </div>
        </div>

        <div class="card">
            <h3>Personality & Voice</h3>
            <select style="margin-bottom: 10px;">
                <option>Friendly (Default)</option>
                <option>Professional</option>
                <option>Humorous</option>
            </select>
            
            <select>
                <option>Female Voice 1</option>
                <option>Male Voice 1</option>
                <option>Robot</option>
            </select>
        </div>
    `;

    // Event Listeners
    setTimeout(() => {
        const scanBtn = container.querySelector('#scan-btn');
        const scanLine = container.querySelector('#scan-line');
        const cameraFeed = container.querySelector('#camera-feed');

        if (scanBtn) {
            scanBtn.addEventListener('click', () => {
                scanBtn.textContent = "Scanning...";
                scanBtn.disabled = true;
                scanLine.style.display = 'block';
                scanLine.style.animation = 'scan 2s linear infinite';

                // Add keyframes for scan if not exists
                if (!document.getElementById('scan-style')) {
                    const style = document.createElement('style');
                    style.id = 'scan-style';
                    style.textContent = `
                        @keyframes scan {
                            0% { top: 0; }
                            100% { top: 100%; }
                        }
                    `;
                    document.head.appendChild(style);
                }

                setTimeout(() => {
                    scanBtn.textContent = "Analysis Complete";
                    scanLine.style.display = 'none';
                    cameraFeed.textContent = "✨ Radiant Skin Detected!";
                    cameraFeed.style.color = "#00BFA6";
                    cameraFeed.style.fontWeight = "bold";

                    setTimeout(() => {
                        scanBtn.disabled = false;
                        scanBtn.textContent = "Start Analysis";
                    }, 2000);
                }, 3000);
            });
        }
    }, 0);

    return container;
};
