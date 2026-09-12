window.App = window.App || {};

window.App.Account = function () {
    const container = document.createElement('div');
    container.className = 'container fade-in';

    const isLoggedIn = window.appState.user && window.appState.user.name;

    if (!isLoggedIn) {
        // Login/Signup View
        container.innerHTML = `
            <h1>Account</h1>
            
            <div class="card">
                <h2>Sign In</h2>
                <input type="text" id="login-name" placeholder="Name" />
                <input type="number" id="login-age" placeholder="Age" />
                <button class="btn btn-primary" id="signin-btn" style="width: 100%;">Sign In</button>
            </div>
        `;

        setTimeout(() => {
            const signinBtn = container.querySelector('#signin-btn');
            signinBtn.addEventListener('click', () => {
                const name = container.querySelector('#login-name').value;
                const age = container.querySelector('#login-age').value;

                if (name && age) {
                    window.appState.user = { ...window.appState.user, name, age: parseInt(age) };
                    localStorage.setItem('sdg3_user', JSON.stringify(window.appState.user));
                    window.location.reload();
                } else {
                    alert('Please enter name and age');
                }
            });
        }, 100);

    } else {
        // Profile View
        const user = window.appState.user;

        container.innerHTML = `
            <h1>Account</h1>
            
            <div class="card">
                <h2>👤 ${user.name}</h2>
                <p>Age: ${user.age || 'Not set'}</p>
                <button class="btn btn-danger" id="signout-btn" style="width: 100%; margin-top: 15px;">Sign Out</button>
            </div>

            <h3 style="margin-top: 25px; margin-bottom: 15px;">Accessibility Modes</h3>
            
            <div class="card mode-card" data-mode="default" style="cursor: pointer; border: 2px solid ${window.appState.theme === 'default' ? '#8B5CF6' : 'transparent'};">
                <h3>🟢 Default Mode</h3>
                <p>Standard interface for everyone</p>
            </div>

            <div class="card mode-card" data-mode="elderly" style="cursor: pointer; border: 2px solid ${window.appState.theme === 'elderly' ? '#8B5CF6' : 'transparent'};">
                <h3>👴 Elderly Mode</h3>
                <p>Larger text and high contrast</p>
            </div>

            <div class="card mode-card" data-mode="oku" style="cursor: pointer; border: 2px solid ${window.appState.theme === 'oku' ? '#8B5CF6' : 'transparent'};">
                <h3>♿ OKU Mode</h3>
                <p>Wheelchair accessible routes</p>
            </div>

            <div class="card mode-card" data-mode="parent" style="cursor: pointer; border: 2px solid ${window.appState.theme === 'parent' ? '#8B5CF6' : 'transparent'};">
                <h3>👶 Parent Mode</h3>
                <p>Family-friendly facilities</p>
            </div>
        `;

        setTimeout(() => {
            // Sign out handler
            const signoutBtn = container.querySelector('#signout-btn');
            signoutBtn.addEventListener('click', () => {
                delete window.appState.user.name;
                delete window.appState.user.age;
                localStorage.setItem('sdg3_user', JSON.stringify(window.appState.user));
                window.location.reload();
            });

            // Mode selection
            const modeCards = container.querySelectorAll('.mode-card');
            modeCards.forEach(card => {
                card.addEventListener('click', () => {
                    const mode = card.getAttribute('data-mode');
                    window.updateAppMode(mode);

                    // Update borders
                    modeCards.forEach(c => c.style.border = '2px solid transparent');
                    card.style.border = '2px solid #8B5CF6';

                    if (window.assistant) {
                        window.assistant.say(`Switched to ${mode} mode! 🎯`);
                    }
                });
            });
        }, 100);
    }

    return container;
};
