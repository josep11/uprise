'use strict';
var jacked, jackedError;

function msg(msg)
{
    jacked.log(msg);
}
function msgError(msg)
{
    jackedError.log(msg);
}
$(document).ready(function() {
    jacked = humane.create({baseCls: 'humane-jackedup', addnCls: 'humane-jackedup-success'});
    jackedError = humane.create({baseCls: 'humane-jackedup', addnCls: 'humane-jackedup-error'});
    var timerId;

    timerId = setInterval(function() {
            $('.userPhotoInput, .newUserPhotoInput').each(function()
            {

                if ($(this).val() !== '') {
                    console.log("submit ");

                    if ($(this).hasClass('newUserPhotoInput'))
                    {
                        console.log("no hi ha id d'usuari, estem afegint usuari nou");
                        $('#form-new-user').submit();
                    }else{
                        var idForm = $(this).parent().children('.userId').val();
                        $('#form-'+idForm).submit();
                    }

                    $(this).val('');

                }
            });
    }, 500);

    $('.uploadForm').submit(function() {
        console.log('uploading the file ...');
        $(this).ajaxSubmit({

            error: function(xhr) {
                console.log('Error: ' + xhr.status);
                msgError("Error pujant foto");
            },

            success: function(response) {
                msg('Imatge actualitzada!');
                var imageUrlOnServer = response.path;

                console.log(response.id+ "  "+response.path);

                if (response.id)
                {

                    $('#form-'+response.id).parent().find('.imatge').attr('src',imageUrlOnServer);
                }
                else
                {
                    console.log($('#form-new-user').find('.imatge'));
                    $('#form-new-user').find('.imatge').attr('src',imageUrlOnServer);
                }

            }
        });

        // Have to stop the form from submitting and causing
        // a page refresh - don't forget this
        return false;
    });

});

function clicaUserPhotoInput(e, newUser)
{

    e.preventDefault();
    if (!newUser)
        $(e.target).parent().parent().find('.userPhotoInput').click();
    else
        $('.newUserPhotoInput').click();
}