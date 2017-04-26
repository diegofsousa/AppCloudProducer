/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Variavel global destinada ao IP bridge.
var IpBridge = 0;

// Variavel global destinada ao array de servidores disponíveis.
var servers = new Object();

var com = new Object();

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
         
        $("#modalOn").modal('open');
        $('#ipbridge').html('<p><i class="tiny material-icons">room</i> Nenhum IP conectado</p>');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
    }
};


/*
Função responsável por salvar o IP que o usuário informa.
*/
function saveIPBridge(){
    servers = null;
    IpBridge = $('#add').val();
    console.log($('#add').val());
    var verboseStatus = 'Ok';
    checkStatus()
    $('#ipbridge').html('<p><i class="tiny material-icons">room</i> Conectado ao IP '+IpBridge+'<br><i class="tiny material-icons">cloud_done</i> Status: '+verboseStatus+'</p>');
    $("#modalOn").modal('close');
}


/*
Função responsável pelo evento no botão "Entrar".
*/
function entrar(){
    var server_choice = $('#numbersLocal').val();
    var seq_numbers = $('#textarea1').val();

    console.log("Topic Exchange: " + server_choice);
    console.log("Mensagem: " + seq_numbers);
    
    if (server_choice != null && seq_numbers != '') {
        ajax_num(server_choice, seq_numbers);
    } else {
        var $toastContent = $('<span>Complete todos os campos. :)</span>');
        Materialize.toast($toastContent, 5000);
    }
}

function checkStatus(){
    var aux = false;
    $.ajax({
            url : "http://"+IpBridge+":8000/api/", // the endpoint
            type : "GET", // http method
            async : false,
            success : function(json) {
                console.log('Conectou ao IP');
                aux = true;
                servers = JSON.parse(json);
            },
            beforeSend: function(){
                var $toastContent = $('<span>Conectando ao host...</span>');
                Materialize.toast($toastContent, 5000);
            },
            complete: function(){
                
            },

            // handle a non-successful response
            error : function(xhr,errmsg,err) {
                var $toastContent = $('<span>Falha ao conectar ao host.</span>');
                Materialize.toast($toastContent, 5000);
            }
        });
    return aux;
}

/*
Função responsável por enviar requisição ao servidor bridge buscando o resultado da operação.
*/
function ajax_num(server_choice, seq_numbers){

    $.ajax({
             
            type: "POST",
            data: { mensagem:seq_numbers, topic_exchange:server_choice},
             
            url: "http://"+IpBridge+":8000/api/",
            success: function(result){
                $('#numbersLocal').val('');
                $('#textarea1').val('');
                var $toastContent = $('<span>Mensagem enviada!</span>');
                Materialize.toast($toastContent, 4000);
                console.log(result);
            },

            error : function(xhr,errmsg,err) {
                var $toastContent = $('<span>Falha ao enviar mensagem.</span>');
                Materialize.toast($toastContent, 4000);
            }
        });
         
}






/*
Função responsável por sair do app".
*/
function sair(){
    navigator.app.exitApp();
}


//coding by Diego Fernando