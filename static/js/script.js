let timerInterval;
      let paused = false;

      function startTimer() {
        const hours = document.getElementById('hours').value;
        const minutes = document.getElementById('minutes').value;
        const seconds = document.getElementById('seconds').value;
        const totalSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);

        fetch('/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `hours=${hours}&minutes=${minutes}&seconds=${seconds}`,
        })
          .then(response => response.json())
          .then(data => {
            console.log(data);
            startCountdown(totalSeconds);
          });
      }

      function pauseTimer() {
        paused = !paused;
        fetch('/pause', { method: 'POST' })
          .then(response => response.json())
          .then(data => {
            console.log(data);
            if (paused) {
              clearInterval(timerInterval);
            } else {
              const countdownText = document.getElementById('countdown').textContent;
              const [hours, minutes, seconds] = countdownText.split(':').map(Number);
              const totalSeconds = hours * 3600 + minutes * 60 + seconds;
              startCountdown(totalSeconds);
            }
          });
      }

      function stopTimer() {
        clearInterval(timerInterval);
        fetch('/stop', { method: 'POST' })
          .then(response => response.json())
          .then(data => {
            console.log(data);
          });
      }

      function resetTimer() {
        clearInterval(timerInterval);
        fetch('/reset', { method: 'POST' })
          .then(response => response.json())
          .then(data => {
            console.log(data);
            updateCountdownDisplay(0);
          });
      }

      function startCountdown(duration) {
        let remainingTime = duration;

        timerInterval = setInterval(() => {
          if (remainingTime <= 0) {
            clearInterval(timerInterval);
            return;
          }

          updateCountdownDisplay(remainingTime);
          remainingTime--;

          if (remainingTime % 60 === 0) {
            syncWithServer();
          }
        }, 1000);
      }

      function updateCountdownDisplay(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        document.getElementById('countdown').textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      }

      function syncWithServer() {
        fetch('/status')
          .then(response => response.json())
          .then(data => {
            console.log(data);
            updateCountdownDisplay(data.time_remaining);
          });
      }