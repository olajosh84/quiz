const startBtn = document.querySelector('#start-btn');
const alert = document.querySelector('.alert');
const countDigits = document.querySelectorAll('.digit');
const questionsContainer = document.querySelector('.questions ol');
const switchBtn = document.querySelector('.switch-btn');
const submitBtn = document.getElementById('submit');
const testQuestions = document.querySelector('#test-questions');
const result = document.querySelector('.result');

//set the count down time to 2 minutes  
let countDownTime = 2 * 60;
let autoTime; //for setInerval


window.addEventListener('DOMContentLoaded', (e) => {
    //alert message
    alertMessage("Your quiz has started", "show-start-alert");
    //call the loadQuestions function to load the questions
    loadQuestions();
    //call the timer function to start the timer
    timer();
   
    const optionBtns = document.querySelectorAll('.option-btn');
    optionBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            //alert("tes")
            //selected #3e8da8, wrong #d9534f, correct  #5cb85c 
            const selected = e.target;
            setTimeout(() => {
                selectedBtn(selected);
            }, 1000);
        
        })
    })

    /*check color mode in local storage and apply accordingly*/
    let colorMode = localStorage.getItem('darkMode');
    if(colorMode){
        switchBtn.classList.add('slide');
        document.body.classList.add('dark-mode');
        //testQuestions.classList.toggle('dark-mode');
    } else {
        switchBtn.classList.remove('slide');
        document.body.classList.remove('dark-mode');
        //testQuestions.classList.remove('dark-mode');
    }
    
})



/*start the timer*/
function timer(){
    //get the timer
    const getTimer = () => {
        //change type to string and concatenate minutes with seconds
        let minutes = String(Math.trunc(countDownTime / 60));
        let seconds = String(Math.trunc(countDownTime % 60));

        //add leading zero if only one digit
        if(minutes.length === 1 || seconds.length === 1){
            minutes = minutes.padStart(2, '0');
            seconds = seconds.padStart(2, '0');
        } 
        return minutes + seconds;
    }

    const showTimer = () => {
        let timer = getTimer();
        countDigits.forEach((digit, index) => {
            digit.innerHTML = timer.charAt(index);
        })
    }
    //initial time
    showTimer();

    function startCountDown() {
        //reduce the time by 1 every one second
        countDownTime--;
        //show warning message if time is down to 60 seconds
        if(countDownTime === 60){
            alertMessage("You have 1 minute remaining", "show-warning-alert");
        }
        //check if time is zero and then stop the timer
        if(countDownTime === 0){
            displayResult();
        }
        showTimer();
    }
    
    autoTime = setInterval(startCountDown, 1000);
    
}

function loadQuestions() {
    //the whole essence is to get 10(non-repeating) random questions from the array of questions
    let randomQuestions = [];
    let i = 10;
    let j = 0;

    while(i--){
        j= Math.floor(Math.random() * (questions.length));
        randomQuestions.push(questions[j]);
        questions.splice(j,1);
    }
    questionsContainer.innerHTML = randomQuestions.map((randomQuestion) => {
        const { id, question, options,answer } = randomQuestion;
        //console.log(typeof id)
        return `
            <li>
                <p>${question}</p>
                <button class="option-btn question${id}" data-id=${id}>${options.option1}</button>
                <button class="option-btn question${id}" data-id=${id}>${options.option2}</button>
                <button class="option-btn question${id}" data-id=${id}>${options.option3}</button>
                <button class="option-btn question${id}" data-id=${id}>${options.option4}</button>
            </li>
            <div class="correct-answer">${answer}</div>
        `
    }).join("");
    
}


//button select function
function selectedBtn(selectedBtn){
    const selectedId = selectedBtn.dataset.id;
    const correctAnswer = selectedBtn.parentNode.nextElementSibling.textContent;
    const selectedAnswer = selectedBtn.textContent;
    selectedBtn.classList.add('selected');
    selectedBtn.classList.remove('option-btn');
    const questionId = `question${selectedBtn.dataset.id}`;
    //get all its siblings and disable them
    const selectedSiblings = document.querySelectorAll(`.${questionId}`);
    selectedSiblings.forEach(sibling => {
        /*sibling.classList.add('selected');
        sibling.classList.remove('option-btn');*/
        if(sibling.textContent === correctAnswer){
            sibling.classList.add('correct-option');
        }
        sibling.setAttribute("disabled", "disabled");
    })
    if(selectedAnswer === correctAnswer){
        //console.log("correct!");
        selectedBtn.classList.add('correct');
    }else{
        //console.log("wrong");
        selectedBtn.classList.add('wrong');
    }
    //console.log(selectedId,selectedAnswer,correctAnswer,selectedSiblings);
}


//change color mode
switchBtn.onclick = (e) => {
    e.currentTarget.classList.toggle('slide')
    document.body.classList.toggle('dark-mode');
    //testQuestions.classList.toggle('dark-mode');
    e.currentTarget.classList.contains('slide') ? localStorage.setItem('darkMode', true) : localStorage.removeItem('darkMode')
 }

const retakeBtn = document.querySelector('.retake-btn');
retakeBtn.onclick = (e) => {
    e.target.parentNode.classList.add('close');
    window.location.reload();
}

//on submit
submitBtn.addEventListener("click", () => { 
    displayResult();
})

function calculateScore(){
    //get all correct answers
    let allCorrectAnswers = document.querySelectorAll('.correct');
    allCorrectAnswers = allCorrectAnswers.length;
    allCorrectAnswers = (allCorrectAnswers / 10) * 100;
    result.classList.add('show');
    const score = document.getElementById('score');
    score.textContent = `${allCorrectAnswers}%`;
}

//top link btn
const topLink = document.querySelector(".top-link");
const navBar = document.querySelector('.navbar');
window.addEventListener("scroll", () => {
    let windowHeight = window.scrollY;
    let navHeight = navBar.getBoundingClientRect().height;
    if(windowHeight > 300){
        topLink.classList.add('show-link');
    }else{
        topLink.classList.remove('show-link');
    }
})

//alert function
function alertMessage(message, className){
    alert.classList.add(className);
    alert.innerHTML = `<p>${message}</p>`;
    //alert disappears after some time
    setTimeout(() => {
        alert.classList.remove(className);
    }, 7000);
}

//result display
function displayResult(){
    //stop timer
    clearInterval(autoTime);
    //show loading div
    testQuestions.style.display = "none";
    const loading = document.querySelector('.loading');
    loading.style.visibility = "visible";

    setTimeout(function(){
        loading.style.visibility = "hidden";
        startConfetti();
        calculateScore();
    }, 5000);
}