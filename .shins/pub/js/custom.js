function hideOneOfProperties() {
    var $oneOf = $('p:contains("oneOf")');
    var $xor = $('p:contains("xor")');
    var $continued = $('p:contains("continued")');
    var $assetRow = $oneOf.prev().find('tbody tr').remove().clone();

    $oneOf.next().remove();
    $oneOf.remove();
    $xor.next().remove();
    $xor.remove();

    $continued.next('table').prepend($assetRow);
    $continued.prev('table').remove();
    $continued.remove();
}

function hideAnyOfProperties() {
    var $anyOf = $('p:contains("anyOf")');
    var $or = $('p:contains("or")');

    $anyOf.next().remove();
    $anyOf.remove();
    $or.next().remove();
    $or.remove();
}

$(document).ready(function() {
    hideOneOfProperties();
    hideAnyOfProperties();
});
