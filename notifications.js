// Request notification permissions on page load
document.addEventListener("DOMContentLoaded", function () {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  
    // Start monitoring tasks for notifications
    monitorTasks();
  });
  
  // Function to monitor tasks and send notifications
  function monitorTasks() {
    setInterval(() => {
      const now = new Date();
  
      todo.forEach((task, index) => {
        if (task.endTime) {
          const [endHours, endMinutes] = task.endTime.split(":").map(Number);
          const taskEndTime = new Date();
          taskEndTime.setHours(endHours, endMinutes, 0, 0);
  
          const timeDifference = taskEndTime - now;
  
          // Notify 5 minutes before the task ends
          if (timeDifference > 0 && timeDifference <= 5 * 60 * 1000 && !task.notifiedBefore) {
            sendNotification(`Task "${task.text}" is about to end in 5 minutes!`);
            task.notifiedBefore = true; // Prevent duplicate notifications
          }
  
          // Notify when the task is complete
          if (timeDifference <= 0 && !task.notifiedComplete) {
            sendNotification(`Task "${task.text}" has been completed!`);
            task.notifiedComplete = true; // Prevent duplicate notifications
          }
        }
      });
  
      // Save updated notification states to local storage
      saveToLocalStorage();
    }, 1000); // Check every second
  }
  
  // Function to send a notification
  function sendNotification(message) {
    if (Notification.permission === "granted") {
      new Notification("To-Do List Notification", {
        body: message,
        icon: "https://cdn-icons-png.flaticon.com/512/847/847969.png", // Optional: Add an icon
      });
    }
  }
  