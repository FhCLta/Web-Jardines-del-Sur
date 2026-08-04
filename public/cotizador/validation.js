document.addEventListener("DOMContentLoaded", function () {
    const camposNumericos = ["metrosExcedentes", "mesesPagarEnganche"];

    camposNumericos.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener("input", function () {
                if (parseFloat(this.value) < 0) {
                    this.value = 0;
                }
            });
        }
    });
});
