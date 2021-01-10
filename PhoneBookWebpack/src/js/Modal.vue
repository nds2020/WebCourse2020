<template>
    <div ref="dialogTemplate" class="modal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ dialogTitleText }}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">{{ dialogBodyText }}</div>
                <div class="modal-footer">
                    <template v-if="isConfirmDialog">
                        <button type="button" class="btn btn-secondary col-3" data-dismiss="modal">Нет</button>
                        <button @click="clickYes" type="button" class="btn btn-primary col-3">Да</button>
                    </template>
                    <template v-else>
                        <button type="button" class="btn btn-primary col-3" data-dismiss="modal">Ок</button>
                    </template>
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
            dialogTitleText: "",
            dialogBodyText: "",
            isConfirmDialog: false
        };
    },

    methods: {
        prepare(isConfirmDialog, dialogTitleText, dialogBodyText, functionOnYesButton) {
            this.isConfirmDialog = isConfirmDialog;
            this.dialogTitleText = dialogTitleText;
            this.dialogBodyText = dialogBodyText;
            this.onYesFunction = functionOnYesButton;
        },

        show() {
            $(this.$refs.dialogTemplate).modal("show");
        },

        clickYes() {
            this.onYesFunction();
            $(this.$refs.dialogTemplate).modal("hide");
        },
    }
}
</script>