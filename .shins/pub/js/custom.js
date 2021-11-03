function formatClipAssets() {
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

$(document).ready(function() {
    formatClipAssets();
});
