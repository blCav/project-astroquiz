const data = `[
    {
        "number" : "01",
        "namePlanet" : "Mercure",
        "question" : "De combien de millions de kilomètres est estimé l’éloignement de la planète Mercure par rapport au Soleil ?",
        "choices" : [
            "Entre 35 et 62 millions",
            "Entre 29 et 54 millions",
            "Entre 44 et 69 millions",
            "Entre 46 et 70 millions"
        ],
        "correctAnswer" : 3
    },
    
    {
        "number" : "02",
        "namePlanet" : "Vénus",
        "question" : "Dans la culture occidentale, sous quel autre nom la planète Vénus est-elle connue ?",
        "choices" : [
            "Étoile du Matin",
            "Étoile du Soir",
            "Étoile du Berger",
            "Planète Soeur de la Terre"
        ],
        "correctAnswer" : 2
    },

    {
        "number" : "03",
        "namePlanet" : "Terre",
        "question" : "En combien de temps la planète Terre réalise-t-elle une rotation complète sur elle-même lors de son orbite quotidienne autour du Soleil ?",
        "choices" : [
            "24 h 02 min 2 s",
            "23 h 54 min 6 s",
            "23 h 56 min 4 s",
            "22 h 53 min 3 s"
        ],
        "correctAnswer" : 2
    },

    {
        "number" : "04",
        "namePlanet" : "Mars",
        "question" : "Quel célèbre astromobile, développé par la NASA, s’est posé sur la planète Mars lors de la journée du 18 Février 2021 ?",
        "choices" : [
            "Opportunity",
            "Curiosity",
            "Spirit",
            "Perseverance"
        ],
        "correctAnswer" : 3
    }
    
]`

const dataQuiz = JSON.parse(data);

let userProfil;
let submittedForm = false;
let listeTable = [];
let score = 0;
let count = 0;

$("#form-inscription").validate(
    {
        rules : {

            prenom : {

            required:true,
            alphanumerique : true
        },

            nom : {

            required: true,
            alphanumerique : true
        },

            dateNaissance : {

            required : true,
            dateInférieureDateDuJour : true
        },

            statut : {

            required : true,
        }     
        },

        messages:{

            prenom : {
                 required:"Le prénom est obligatoire",

             },

             nom : {
                required: "Le nom est obligatoire",
               
            },

            dateNaissance : {
                required : "La date de naissance est obligatoire"
             },

             statut : {
                 required : "Le statut est obligatoire"
             }
        },

        submitHandler: function () {
      
            showQuiz();
            saveUserProfil();
            submitQuestion();
       
        }, 

        showErrors: function (errorMap, errorList) {
             if (submittedForm) {
                 const div = $("<div></div>");
                $.each(errorList, function () {
                     div.append(`<span class="error-list"><img src="img/error-icon.svg" alt"Icône erreur">${this.message}</span><br>`);
                });
                 $('.container-message').html(div)
                 submittedForm = false;
              }
               this.defaultShowErrors();
         },
        invalidHandler: function (form, validator) {
            submittedForm = true;
        },
    }
);

//Ajout de validations supplémentaires pour le formulaire d'inscription
jQuery.validator.addMethod(
    "alphanumerique",
    function (value, element) {
      return this.optional(element) || /^[\w.]+$/i.test(value);
    },
    "Veuillez écrire uniquement des lettres, nombres et tirets du bas"
);

$.validator.addMethod(
    "dateInférieureDateDuJour",
    function (value, element) {
      const dateActuelle = new Date();
      return this.optional(element) || dateActuelle >= new Date(value);
    },
    "La date de naissance doit être obligatoirement inférieure à la date d'aujourd'hui"
);

// Sauvegarde des informations de l'utilisateur
let userData;

function saveUserProfil() {

        userData = [];
        let userFirstName = $('#prenom');
        let userName = $("#nom");
        let userBirthday = $('#dateNaissance');
        let userStatut = $("#statut");

        let userDataObject = {
            prenom : userFirstName.val(),
            nom : userName.val(),
            dateNaissance : userBirthday.val(),
            statut :  userStatut.val()
        }

        userData.push(userDataObject);
}

// Affichage du quiz
function showQuiz(){
    $('.js-container-index').addClass('d-none');
    $('.js-container-quiz').removeClass('d-none');
    renderQuestionForm();
    displayTimer();
    tryAgain()

    $("#next").hide()
} 

// Affichage des questions du quiz
function renderQuestionForm() {
    if (count <= 3) {
        $("#form-quiz").slideUp(1000);
        setTimeout(function(){
            $("#number").text(`${dataQuiz[count].number}`);
            $("#namePlanet").text(`${dataQuiz[count].namePlanet}`);
            $("#question").text(`${dataQuiz[count].question}`);
            
            $("#groupe1-boutons-radios").html(`<div class="btn-radio"><input id='option1' type="radio" name='answer'value='${dataQuiz[count].choices[0]}' required><label for='option1'>${dataQuiz[count].choices[0]}</label></div>
            <div class="btn-radio"><input id='option2' type="radio" name='answer' value='${dataQuiz[count].choices[1]}' required><label for='option2'>${dataQuiz[count].choices[1]}</label></div>`);

            $("#groupe2-boutons-radios").html(`<div class="btn-radio"><input id='option3' type="radio" name='answer' value='${dataQuiz[count].choices[2]}' required><label for='option3'>${dataQuiz[count].choices[2]}</label></div>
            <div class="btn-radio"><input id='option4' type="radio" name='answer' value='${dataQuiz[count].choices[3]}' required><label for='option4'>${dataQuiz[count].choices[3]}</label></div>`);

            $("#next").show()

            $(".btn-radio").on("click", function(){
            makeActive();

        })}, 1000)

        $("#form-quiz").slideDown(4000);
        $("#finish").hide();
    }
}

function increaseDataCount() {
    count++;
    progressBar();
    if(count === dataQuiz.length) {
        $("#next").hide();
        $("#finish").show();
        renderModal();
    }
}

// Ajout de la class active sur le container du bouton radio
function makeActive(){
    $(".btn-radio").removeClass("active");

    let active = $('input[type=radio]:checked');

    if (active.is(':checked')) {
        active.parent().addClass("active")
    }
}

// Soumission formulaire des questions du Quiz 
function submitQuestion() {
    $(".form-quiz").on("submit", event => {
        event.preventDefault();
        checkAnswer();
        increaseDataCount();
        renderQuestionForm();
    });
}

// Barre de progression
function progressBar() {
    let width = count / dataQuiz.length * 100;
    $(".progress-bar").css("width", width + "%");
}

// Affichage du modale
function renderModal(){

    $("#finish").on('click', function(){
        $(".js-container-modal").show();

     if(score === 0){

            $("#messageFeedback").html("<span style='color: #F6583E;'>Échec !</span> Mission annulée !");
            $("#phraseFeedback").html("Allo Houston ?<br>Je crois que nous avons un problème...");
            $("#scoreFeedback").text(" 0% ").css("color", "#F6583E");

        } else if (score === 10) {

            $("#messageFeedback").html("<span style='color: #789BB9;'>C'est tout ?</span> Tu t'es perdu.e dans l'espace...");
            $("#phraseFeedback").html("Le retour sur Terre,<br>c'était la partie la plus difficile...");
            $("#scoreFeedback").text(" 10% ").css("color", "#789BB9");

        } else if (score <= 20 || score <= 30) {

            $("#imageModal").attr("src", "img/img-avatar-rocket-v2.svg").attr("alt", "Illustration de fusée en plein vol")
            $("#messageFeedback").html("<span style='color: #FEE149;'>Bien joué !</span> Tu es proche de la lune !");
            $("#phraseFeedback").html("Nous ne sommes limités que par<br>notre imagination et notre volonté d'agir.");
            $("#scoreFeedback").text(" 70% ").css("color", "#FEE149");

        } else if (score === 40) {

            $("#imageModal").attr("src", "img/img-avatar-rocket-v2.svg").attr("alt", "Illustration de fusée en plein vol")
            $("#messageFeedback").html("<span style='color: #25CD89;'>Bravo !</span> Tu as réussi ton aventure !");
            $("#phraseFeedback").html("C'est un petit pas pour l'Homme,<br>un bon de géant pour l'Humanité !");
            $("#scoreFeedback").text(" 100% ").css("color", "#25CD89");
        }
        $('.modal').modal('show');
    });

    $("#resultDetails").on('click', function(){
        $('.modal').modal('hide');
        $('.js-container-quiz').addClass('d-none');
        renderResultsDetails();
    });
    
}

// Sauvegarde des réponses de l'utilisateur & Calcul du score
let numberCorrectAnswer = 0;

function checkAnswer() {

    let userAnswer = $('input[name=answer]:checked', '#form-quiz').val();
    if (count <= 3) {
        if (userAnswer === `${dataQuiz[count].choices[dataQuiz[count].correctAnswer]}`) {
            score += 10;
            numberCorrectAnswer++;
        } else if (userAnswer !== `${dataQuiz[count].choices[dataQuiz[count].correctAnswer]}`) { 
            score += 0;
        }
    } 

    listeTable.push(userAnswer);
}

// Affichage des résultats de l'utilisateur
function renderResultsDetails() {
    $(".js-container-result").removeClass('d-none');  
    renderUserInformations();
    renderUserResult();
    renderDataTableQuiz();
    renderAccordionQuiz();
    checkResultTable(); 
    tryAgain()
}

// Affiche les informations de l'utilisateur
function renderUserInformations() {
    $(".title-name").text(userData[0].prenom + " " + userData[0].nom);
    $(".statut").text(userData[0].statut);
    $(".dateNaissance").text(getUserAge(userData[0].dateNaissance) + " " + "ans");
}

// Calcul l'âge de l'utilisateur selon sa date de naissance
function getUserAge(dateString){

    let birthdayUser = dateString.split("-");
    let actualDate = new Date();

    let yearOfBirth = parseInt(birthdayUser[0]);
    let monthOfBirth = parseInt(birthdayUser[1]);
    let dayOfBirth = parseInt(birthdayUser[2]);

    let currentYear = actualDate.getFullYear();
    let currentMonth = actualDate.getMonth();
    let currentDay = actualDate.getDate();

    let ageUser = currentYear - yearOfBirth;
    let ageMonthUser = currentMonth - monthOfBirth;
  
    if ( ageMonthUser <= 0 || (ageMonthUser === 0 && dayOfBirth < currentDay)) {
        ageUser

    }

    return ageUser;  
}

// Affichage du score de l'utilisateur
function renderUserResult() {

    if ( score === 0) {

        $("#phraseFeedbackDetail").html("Allo Houston ?<br>Je crois que nous avons un problème...");
        $("#citationFeedbackDetail").text("Jim Lovell");
        $("#scoreDetail").text(" 0% ").css("color", "#F6583E");
        $("#resultDetail").text(numberCorrectAnswer + " bonnes réponses sur " + dataQuiz.length);

    } else if (score === 10) {

        $("#phraseFeedbackDetail").html("Le retour sur Terre, c'était la partie la plus difficile...");
        $("#citationFeedbackDetail").text("Buzz Aldrin");
        $("#scoreDetail").text(" 10% ").css("color", "#789BB9");
        $("#resultDetail").text(numberCorrectAnswer + " bonne réponse sur " + dataQuiz.length);

    } else if (score <= 20 || score <= 30) {

        $("#imageResult").attr("src", "img/img-avatar-rocket-v2.svg").attr("alt", "Image de fusée en plein vol")
        $("#phraseFeedbackDetail").html("Nous ne sommes limités que par<br>notre imagination et notre volonté d'agir.");
        $("#citationFeedbackDetail").text("Ron Garan");
        $("#scoreDetail").text(" 70% ").css("color", "#FEE149");
        $("#resultDetail").text(numberCorrectAnswer + " bonnes réponses sur " + dataQuiz.length);

    } else if (score === 40) {

        $("#imageResult").attr("src", "img/img-avatar-rocket-v2.svg").attr("alt", "Image de fusée en plein vol")
        $("#phraseFeedbackDetail").html("C'est un petit pas pour l'Homme,<br>un bon de géant pour l'Humanité !");
        $("#citationFeedbackDetail").text("Neil Armstrong");
        $("#scoreDetail").text(" 100% ").css("color", "#25CD89");
        $("#resultDetail").text(numberCorrectAnswer + " bonnes réponses sur " + dataQuiz.length);
    }
}

// Calcul des bonnes/mauvaises réponses de l'utilisateur
function checkResultTable() {

    listeTable.pop();

    for (let i = 0; i < listeTable.length; i++) {
        let userAnswerTable = listeTable[i];

        if (userAnswerTable === `${dataQuiz[i].choices[dataQuiz[i].correctAnswer]}`) {
            $("#resultTable" + [i]).text("Bonne réponse !");
        } else {
            $("#resultTable" + [i]).text("Mauvaise réponse !");
        }
    }
}

//Affichage du tableau avec les bonnes/mauvaises réponses de l'utilisateur
function renderDataTableQuiz() {
    
    for (let i = 0; i < dataQuiz.length; i++) {

    let content = `
    <tr>
      <td>${dataQuiz[i].number}</td>
      <td>${dataQuiz[i].question}</td>
      <td id="resultTable${i}"></td>
    </tr>
    `;
    $("#dataTableContent").append(content);
    }

    $("#tableQuizResult").DataTable({

        "language": {
            
            "search": "Rechercher :",
            "info": "Affichage de _START_ à _END_ sur _TOTAL_ entrées",
            "infoFiltered": "(filtrées depuis un total de _MAX_ entrées)",
            "infoEmpty": "Aucune donnée disponible",
            "loadingRecords": "Chargement...",
            "processing": "En cours...",
            "zeroRecords": "L'élément recherché n'existe pas",
            "lengthMenu": "Afficher _MENU_ entrées",
            "paginate": {
                "first": "Premier",
                "last": "Dernier",
                "next": "Suivant",
                "previous": "Précédent"
            }
        }
    });
}

// Affichage de l'accordéon avec les données du Quiz
function renderAccordionQuiz(){

    for( let i = 0; i < dataQuiz.length; i++) {

        const accordionData = dataQuiz[i];
        const accordion = `
        <div class="card">
          <div class="card-header" id="heading${i}">
            <h2 class="mb-0">
                 <button button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="false" aria-controls="collapse${i}">
                ${accordionData.number} - ${accordionData.question}
                </button>
            </h2>
          </div>

          <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionQuizResponses">
                <div class="card-body">
                    <p>Réponse : ${accordionData.choices[0]}</p>
                    <p>Réponse : ${accordionData.choices[1]}</p>
                    <p>Réponse : ${accordionData.choices[2]}</p>
                    <p>Réponse : ${accordionData.choices[3]}</p>
                    <p class="goodAnswer">Bonne Réponse : ${accordionData.choices[accordionData.correctAnswer]}</p>
   
                </div>
          </div>
        </div>
        `
        $("#accordionQuizResponses").append(accordion);

    }
}

// Affichage du timer du Quiz
function displayTimer() {
    let settingTimer = 60 * 4;
    startTimer(settingTimer);
}

// Calcul du Timer du Quiz
function startTimer(duration) {

    let timer = duration, minutes, secondes;

    let time = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        secondes = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        secondes = secondes < 10 ? "0" + secondes : secondes;

        $(".timer").text(minutes + " : " + secondes);
            
        if (--timer < 0) {
            timer = duration
            clearInterval(time);
            $('.container-timer').text("Temps écoulé ! ");
            $(".container-quiz").html('<h2 style="text-align: center">Pour relancer le quiz, appuie sur ASTROQUIZ !  :)</h2>');
            tryAgain()

        }
    }, 1000);
}

// Bouton pour relancer le Quiz
function tryAgain(){

    $(".logo").on("click", function(){
        $(".js-container-index").removeClass("d-none");
        $(".js-container-result").addClass("d-none");
        location.reload();
    })
}