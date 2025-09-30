// Script to reset progress percentages for testing
// Run this in browser console to reset progress for the current user

function resetProgress() {
  const authUser = localStorage.getItem('auth_user');
  if (!authUser) {
    console.log('No user logged in');
    return;
  }
  
  const user = JSON.parse(authUser);
  const studentKey = `student_data_${user.email.toLowerCase()}`;
  const studentData = localStorage.getItem(studentKey);
  
  if (!studentData) {
    console.log('No student data found');
    return;
  }
  
  const student = JSON.parse(studentData);
  
  // Reset topics to realistic starting values
  student.topics = [
    { 
      name: "Quantitative Aptitude", 
      progress: 25, 
      questionsCompleted: 45, 
      recentScore: 65, 
      subTopics: ["Number Systems", "Percentages", "Algebra", "Geometry", "Time & Work"] 
    },
    { 
      name: "Logical Reasoning & DI", 
      progress: 18, 
      questionsCompleted: 32, 
      recentScore: 58, 
      subTopics: ["Puzzles", "Data Interpretation", "Arrangements", "Blood Relations", "Coding-Decoding"] 
    },
    { 
      name: "Verbal Ability & RC", 
      progress: 30, 
      questionsCompleted: 38, 
      recentScore: 70, 
      subTopics: ["Reading Comprehension", "Para Jumbles", "Vocabulary", "Critical Reasoning", "Grammar"] 
    }
  ];
  
  // Recalculate overall progress
  const sum = student.topics.reduce((acc, t) => acc + t.progress, 0);
  student.overallProgress = Math.round(sum / student.topics.length);
  
  // Save back to localStorage
  localStorage.setItem(studentKey, JSON.stringify(student));
  
  console.log('Progress reset successfully!');
  console.log('New topic progress:', student.topics.map(t => `${t.name}: ${t.progress}%`));
  console.log('Overall progress:', student.overallProgress + '%');
  
  // Refresh page to see changes
  location.reload();
}

resetProgress();