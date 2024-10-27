document.addEventListener('DOMContentLoaded', () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const waveformSelect = document.getElementById('waveform');
    const attackInput = document.getElementById('attack');
    const decayInput = document.getElementById('decay');
    const sustainInput = document.getElementById('sustain');
    const releaseInput = document.getElementById('release');

    function playNote(note) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = waveformSelect.value;
        oscillator.frequency.value = noteFrequency(note);
        
        const now = audioContext.currentTime;
        const attack = parseFloat(attackInput.value);
        const decay = parseFloat(decayInput.value);
        const sustain = parseFloat(sustainInput.value);
        const release = parseFloat(releaseInput.value);
        
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(1, now + attack);
        gainNode.gain.linearRampToValueAtTime(sustain, now + attack + decay);
        
        oscillator.connect(gainNode).connect(audioContext.destination);
        oscillator.start();
        
        return {
            oscillator,
            gainNode,
            stop: () => {
                const releaseStart = audioContext.currentTime;
                gainNode.gain.linearRampToValueAtTime(0, releaseStart + release);
                oscillator.stop(releaseStart + release);
            }
        };
    }

    function noteFrequency(note) {
        const A4 = 440;
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const octave = parseInt(note.slice(-1));
        const keyNumber = notes.indexOf(note.slice(0, -1));

        if (keyNumber < 3) {
            keyNumber = keyNumber + 12 + ((octave - 1) * 12) + 1;
        } else {
            keyNumber = keyNumber + ((octave - 1) * 12) + 1;
        }

        return A4 * Math.pow(2, (keyNumber - 49) / 12);
    }

    const keys = {};
    document.querySelectorAll('.key').forEach(key => {
        key.addEventListener('mousedown', () => {
            const note = key.dataset.note;
            if (keys[note]) return;

            key.classList.add('active');
            keys[note] = playNote(note + '4');
        });

        key.addEventListener('mouseup', () => {
            const note = key.dataset.note;
            if (keys[note]) {
                keys[note].stop();
                delete keys[note];
            }
            key.classList.remove('active');
        });

        key.addEventListener('mouseleave', () => {
            const note = key.dataset.note;
            if (keys[note]) {
                keys[note].stop();
                delete keys[note];
            }
            key.classList.remove('active');
        });
    });

    document.addEventListener('mouseup', () => {
        for (const note in keys) {
            keys[note].stop();
            delete keys[note];
        }
        document.querySelectorAll('.key.active').forEach(key => key.classList.remove('active'));
    });
});
