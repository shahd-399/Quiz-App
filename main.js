let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestions(){
    let myRequest = new XMLHttpRequest();

    myRequest.open('GET','https://opentdb.com/api.php?amount=10')
    myRequest.send();

    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200){
            let questionsList = (JSON.parse(this.responseText).results);

            //get length of arr
            let qCount = questionsList.length;

            // Create Bullets + Set Questions Count
            createBullets(qCount);

            // Add Question Data
            addQuestionData(questionsList[currentIndex], qCount);

            //start countDown
            countdown(30, qCount);

            submitButton.onclick = () => {
                //right answer
                let theRightAnswer = questionsList[currentIndex].correct_answer
        
                //increase index
                currentIndex++;
    
                //check the Answer
                checkAnswer(theRightAnswer);
    
                //remove previous question
                quizArea.innerHTML = "";
                answersArea.innerHTML = "";
    
                //add next question
                addQuestionData(questionsList[currentIndex], qCount);
    
                //handle bullets Class
                handleBullets();
    
                // Start CountDown
                clearInterval(countdownInterval);
                countdown(30, qCount);
    
                // show results
                showResults(qCount);
            };
        };

    }
}

getQuestions()

function createBullets(num){
    countSpan.innerHTML = num

    //create spans
    for(let i=0 ; i<num ; i++){
        let theBullet = document.createElement('span');

        //first span when start
        if(i == 0 ){
            theBullet.className ='on'
        }

        bulletsSpanContainer.appendChild(theBullet);
    }

}

function addQuestionData(obj , num){
    if(currentIndex < num){
        //create question(h2)
    let quesTitle = document.createElement('h2');

    let quesText =document.createTextNode(obj.question)

    quesTitle.appendChild(quesText);
    quizArea.appendChild(quesTitle)

    //get all answers and randomize it
    let allAnswers = obj.incorrect_answers;
    allAnswers.push(obj.correct_answer)
    var randomAnswer = randomNoRepeats(allAnswers);

    //create answers
    for(let i=0 ; i < allAnswers.length ; i++){
        //create main div
        let mainDiv = document.createElement('div');
        //add class to main div
        mainDiv.className = 'answer';

        let radioInput = document.createElement("input");

        //add type + name + id + data-attribute
        radioInput.name = "question";
        radioInput.type = "radio";
        radioInput.id = `answer_${i+1}`;
        radioInput.dataset.answer = randomAnswer();

        //make first option selected
        if(i == 0){
            radioInput.checked = true;
        }

        //create label
        let theLabel = document.createElement("label");

        //add for attribute
        theLabel.htmlFor = `answer_${i+1}`;

        // create label text
        let theLabelText = document.createTextNode( radioInput.dataset.answer);

        //add the text to label
        theLabel.appendChild(theLabelText);
        // add to th main div
        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(theLabel);
        answersArea.appendChild(mainDiv);

    }
    }
}

function checkAnswer(rightAnswer){
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;

    for (let i = 0; i < answers.length; i++){
        if(answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }

    if(rightAnswer === theChoosenAnswer){
        rightAnswers++;
    }
}

function handleBullets(){
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = "on";
        }
    });
}

function showResults(num){
    let theResults;

    if (currentIndex === num){
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();

        if (rightAnswers >= num / 2 && rightAnswers < num){
            theResults = `<span class="good">Good</span>, ${rightAnswers} From ${num}`;
        }
        else if (rightAnswers === num){
            theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
        }
        else{
            theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${num}`;
        }
        resultsContainer.innerHTML = theResults;
        resultsContainer.style.padding = "10px";
        resultsContainer.style.backgroundColor = "white";
        resultsContainer.style.marginTop = "10px";
    }
}

function countdown(duration, num){
    if (currentIndex < num) {
        let minutes, seconds;
        countdownInterval = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countdownElement.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0) {
                clearInterval(countdownInterval);
                submitButton.click();
            }
        }, 500);
    }
}

//Randomize the answers
function randomNoRepeats(array) {
    var copy = array.slice(0);
    return function() {
        if (copy.length < 1){ 
            copy = array.slice(0); 
        }
        var index = Math.floor(Math.random() * copy.length);
        var item = copy[index];
        copy.splice(index, 1);
        return item;
    };
}
