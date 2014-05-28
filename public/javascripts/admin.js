// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {
    console.log("hola");
    // Populate the user table on initial page load
    //emptyTable();
    //populateTable();

});

// Functions =============================================================

function emptyTable()
{
    $('#taula').html('');
}

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/api/users', function( data ) {
        var taula = $('#taula');
        tableContent = taula.html();
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            //console.log($(this)[0].image.url);
            tableContent += '<tr class="alinear-mig">"';
            tableContent += '<form enctype="multipart/form-data" action="/api/photos" method="post" id="form-'+$(this)[0]._id+'" class="uploadForm"></form>';
            tableContent += '<th class="col-md-4"><input type="text" value="'+$(this)[0].name+'" required="" class="userName"></th>';
            tableContent += '<th class="col-md-4"><input type="text" value="'+$(this)[0].surnames+'" required="" class="userSurnames"></th>';
            tableContent += '<th class="col-md-4"><input type="text" value="'+$(this)[0].email+'" required="" class="userEmail">'+
                                                 '<input type="hidden" value="'+$(this)[0]._id+'" id="'+$(this)[0]._id+'" name="id" class="userId">' +
                                                 '<input type="file" name="userPhoto" style="visibility:hidden; display:none" class="userPhotoInput"></th>';
            tableContent += '<th class="col-md-3"><img src="'+$(this)[0].image.url+'" width="70" height="70" onclick="clicaUserPhotoInput(event)" class="imatge botonsEditar"></th>';
            tableContent += '<th class="col-md-"><img src="/images/edit.png" width="32" height="32" class="botonsEditar edit"></th>';
            tableContent += '<th class="col-md-1"><img src="/images/delete.png" width="32" height="32" class="botonsEditar delete"></th>';
            tableContent += '</tr>';

        });

        // Inject the whole content string into our existing HTML table
        taula.html(tableContent);
        //Listeners
        taula.on('click','.edit',editUser);
        taula.on('click','.delete',deleteUser);
    });
};

function addUserToTable(data) {


    var taula = $('#taula'),
        tableContent = taula.html();


    tableContent += '<tr class="alinear-mig">"';
    tableContent += '<form enctype="multipart/form-data" action="/api/photos" method="post" id="form-'+data._id+'" class="uploadForm"></form>';
    tableContent += '<th class="col-md-4"><input type="text" value="'+data.name+'" required="" class="userName"></th>';
    tableContent += '<th class="col-md-4"><input type="text" value="'+data.surnames+'" required="" class="userSurnames"></th>';
    tableContent += '<th class="col-md-4"><input type="text" value="'+data.email+'" required="" class="userEmail">'+
        '<input type="hidden" value="'+data._id+'" id="'+data._id+'" name="id" class="userId">' +
        '<input type="file" name="userPhoto" style="visibility:hidden; display:none" class="userPhotoInput"></th>';
    tableContent += '<th class="col-md-3"><img src="'+data.image.url+'" width="70" height="70" onclick="clicaUserPhotoInput(event)" class="imatge botonsEditar"></th>';
    tableContent += '<th class="col-md-"><img src="/images/edit.png" width="32" height="32" class="botonsEditar edit"></th>';
    tableContent += '<th class="col-md-1"><img src="/images/delete.png" width="32" height="32" class="botonsEditar delete"></th>';
    tableContent += '</tr>';



    taula.html(tableContent);
    //Listeners
    taula.on('click','.edit',editUser);
    taula.on('click','.delete',deleteUser);

}

$('#enviar').on('click', envia);
function envia(e){
    console.log("enviar");
    var name = $('#name').val(),
        surnames = $('#surnames').val(),
        email = $('#email').val(),
        url = $('#form-new-user').find('.imatge').attr('src');

    if (name && surnames && email)
    {
        jQuery.post("/api/users", {
            "name": name,
            "surnames": surnames,
            "email": email,
            "image": url
        }, function (data, textStatus, jqXHR) {
            console.log("Post resposne:"); console.dir(data); console.log(textStatus); console.dir(jqXHR);
            if (textStatus == "success") msg("Usuari afegit correctament");
        });

        esborrarDades();
        /*var data = {name: name, surnames: surnames, email: email, _id: 'inventada', image: {url: url}};
        addUserToTable(data);*/
    } else {
        msgError("Omple tots els camps abans d'enviar");
    }
}

function esborrarDades()
{
    $('#name').val('').attr('placeholder','Name');
    $('#surnames').val('').attr('placeholder','Surnames');
    $('#email').val('').attr('placeholder','Email');
    $('#form-new-user').find('.imatge').attr('src',"http://faytoday.com/wp-content/uploads/2013/03/default_profile.jpg");
}

$('.edit').on('click', editUser);
function editUser(e)
{

    var parent = $(this).parent().parent(), //formulari
        name = $('.userName', parent).val(),
        surnames = parent.find('.userSurnames').val(),
        email = parent.find('.userEmail').val(),
        url = parent.find('.imatge').attr('src'),
        id = parent.find('.userId').val();//$('.userId', parent.parent()).val();

    console.log(name+" "+surnames+" "+email+" "+url+" id="+id);

    if (name && surnames && email)
    {
        jQuery.ajax({
            url: "/api/users/"+id,
            type: "PUT",
            data: {
                "name": name,
                "surnames": surnames,
                "email": email,
                "image": url
            },
            success: function (data, textStatus, jqXHR) {
                console.log("Post resposne:");
                console.dir(data);
                console.log(textStatus);
                console.dir(jqXHR);
                if (textStatus == "success") msg("Usuari actualitzat correctament");
            }
        });
    }else {
        msgError("Omple tots els camps abans d'enviar");
    }

}

$('.delete').on('click', deleteUser);
function deleteUser(e)
{
    if(confirm('Segur que vols esborrar l"usuari?'))
    {
        var parent = $(this).parent(),
            id = $('.userId', parent.parent()).val();
        console.log(parent);
        jQuery.ajax({
            url: "/api/users/"+id,
            type: "DELETE",
            success: function (data, textStatus, jqXHR) {
                console.log("Post resposne:");
                console.dir(data);
                console.log(textStatus);
                console.dir(jqXHR);
                if (textStatus == "success") msg("Usuari esborrat satisfactòriament");
            }
        });

        parent.parent().remove();
        console.log("eliminem user amb id = "+id);
    }

}