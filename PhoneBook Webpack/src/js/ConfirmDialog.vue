<template>
    <div ref="confirmDialogTemplate" class="modal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ confirmDialogTitleText }}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">{{ confirmDialogBodyText }}</div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary col-3" data-dismiss="modal">Нет</button>
                    <button @click="clickYes" type="button" class="btn btn-primary col-3">Да</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $ from "jquery";

export default {
    data() {
        return {
            onYesFunction: null,
            confirmDialogTitleText: "",
            confirmDialogBodyText: ""
        };
    },

    methods: {
        prepare(functionOnYesButton, confirmDialogTitleText, confirmDialogBodyText) {
            this.onYesFunction = functionOnYesButton;
            this.confirmDialogTitleText = confirmDialogTitleText;
            this.confirmDialogBodyText = confirmDialogBodyText;
        },

        show() {
            $(this.$refs.confirmDialogTemplate).modal("show");
        },

        clickYes() {
            this.onYesFunction();
            $(this.$refs.confirmDialogTemplate).modal("hide");
        }
    }
}
</script>