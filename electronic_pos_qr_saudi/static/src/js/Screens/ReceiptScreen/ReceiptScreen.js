function printReceipt(receiptString) {
    try {
        alert("Print Rece Function.");

        if (typeof html2canvas === 'undefined') {
            console.error('html2canvas is not loaded!');
            return;
        }

        var receiptElement = document.createElement('div');
        receiptElement.innerHTML = receiptString;  

        document.body.appendChild(receiptElement);

        html2canvas(receiptElement).then(function(canvas) {
            var img = new Image();
            img.src = canvas.toDataURL(); 

            document.body.appendChild(img);  
            if (window.Android && typeof Android.printReceipts === 'function') {
                Android.printReceipts(img.src);
            } else {
                alert("Android.printReceipts is not available.");
            }

            document.body.removeChild(receiptElement);
        }).catch(function(error) {
            console.error("Error in html2canvas:", error);  
        });
    } catch (error) {
        console.error("Error in printReceipt:", error);  
    }
}

odoo.define("electronic_pos_qr_saudi.ReceiptScreen", function (require) {
    "use strict";

    const Registries = require("point_of_sale.Registries");
    const ReceiptScreen = require("point_of_sale.ReceiptScreen");
    const { useRef } = owl;
    const { onMounted } = owl;
    var core = require('web.core');
    var _t = core._t;

    const PosResOrderReceipt = (ReceiptScreen) =>
    class extends ReceiptScreen {
        setup() {
            super.setup();
            this.shorderReceipt = useRef('order-receipt');
            onMounted(this.onMounted);
        }

        onMounted() {
            var self = this;
            var is_gcc_country = ['SA', 'AE', 'BH', 'OM', 'QA', 'KW'].includes(self.env.pos.company.country.code);

            if (self.env.pos.config.display_qr_code && is_gcc_country) {
                $('.pos-receipt-container').addClass('sh_receipt_content');
            }
            if (_t.database.parameters.direction) {
                $('.sh_receipt_content').css('direction', 'ltr');
            }

            const receiptString = this.shorderReceipt.el.outerHTML;
            alert("onMounted Function.");
            printReceipt(receiptString);  
        }
    };

    Registries.Component.extend(ReceiptScreen, PosResOrderReceipt);

});
