function hideDiscriminatorTables() {
    var $discriminatorTable = $('em:contains("anonymous")').closest('table');

    $discriminatorTable.prevUntil('#properties').remove();
    $discriminatorTable.prev().remove();
    $discriminatorTable.remove();
}

$(document).ready(function() {
    hideDiscriminatorTables();
});
