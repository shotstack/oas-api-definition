function hideDiscriminatorColumn() {
    $('table em:contains("anonymous")').each(function() {
        var $em = $(this);
        var $td = $em.closest('td');
        var colIndex = $td.index();
        $td.closest('table').find('tr').each(function() {
            $(this).find('td:eq(' + colIndex + ')').remove();
            $(this).find('th:eq(' + colIndex + ')').remove();
        });
    });
}

function updateOneOfText() {
    $('p:contains("oneOf")').each(function() {
        var updatedText = $(this).text().replace(/oneOf/g, 'Value must be one of the following:');
        $(this).text(updatedText);
    });
}

function updateAnyOfText() {
    $('p:contains("anyOf")').each(function() {
        var updatedText = $(this).text().replace(/anyOf/g, 'Value can be any combination of the following:');
        $(this).text(updatedText);
    });
}

function replaceXorWithOr() {
    $('p:contains("xor")').each(function() {
        var updatedText = $(this).text().replace(/xor/gi, '- or -');
        $(this).text(updatedText);
    });
}

function removeContinuedTag() {
    $('p').each(function() {
        if ($.trim($(this).text()) === 'continued') {
            $(this).remove();
        }
    });
}

$(document).ready(function() {
    updateOneOfText();
    updateAnyOfText();
    hideDiscriminatorColumn();
    replaceXorWithOr();
    removeContinuedTag();
});
