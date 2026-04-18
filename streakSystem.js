export function addStreak() {
    //Get streak data from storage
    const streakData = JSON.parse(localStorage.getItem('streakData')) || { count: 0, lastDate: null };
    const today = new Date().toDateString();

    //Check if the current day is one day after the last recorded date, if so, increment the streak count
    if (streakData.lastDate) {
        const currentDate = new Date(today);
        const lastDate = new Date(streakData.lastDate);

        const timeDiff = currentDate - lastDate;
        const dayDiff = timeDiff / (1000 * 3600 * 24);

        if (dayDiff === 1) {
            //If the last date is yesterday, increment the streak count
            streakData.count += 1;
        } else if (dayDiff > 1) {
            // If more than one day has passed, reset the streak
            streakData.count = 1; // Start a new streak
        }
    } else {
        // If there's no last date, start the streak
        streakData.count = 1;
    }

    //Update last date to today and save back to storage
    streakData.lastDate = today;
    localStorage.setItem('streakData', JSON.stringify(streakData));

    //Update streak display
    if (streakData.count > 1) {
        document.getElementById('streak-display').textContent = `Streak: ${streakData.count} days`;
    } else {
        document.getElementById('streak-display').textContent = `Streak: ${streakData.count} day`;
    }
}