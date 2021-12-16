function addDataSection(toggleMode) {
    var addBtnSec = document.getElementById('add-data-section-btn');
    if (toggleMode === 'HIDE') {
        addBtnSec.style.display = 'none';
    } else {
        addBtnSec.style.display = 'inline-block';
        addBtnSec.click();
    }
}

function hideModal(modalId) {
    var myModalEl = document.getElementById(modalId);
    var modal = bootstrap.Modal.getInstance(myModalEl);
    if (modal) {
        modal.hide();
    }
}