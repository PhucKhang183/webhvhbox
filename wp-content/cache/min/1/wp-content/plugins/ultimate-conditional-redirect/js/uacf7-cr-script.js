(function ($) {
  "use strict";
  jQuery(document).ready(function () {
    uacf7_conditional_redirect_mailsent_handler();
    function uacf7_conditional_redirect_mailsent_handler() {
      document.addEventListener(
        "wpcf7mailsent",
        function (event) {
          var formId = event.detail.contactFormId;
          var form = uacf7_cr_object[formId];
          var formTarget = uacf7_redirect_object[formId];
          var cr_enable = uacf7_redirect_enable[formId];
          var uacf7RedirectType = uacf7_redirect_type[formId];
          var uacf7TagSupport = uacf7_redirect_tag_support[formId];
          if (cr_enable == "yes" && uacf7RedirectType == "yes") {
            jQuery(form).each(function () {
              var $tgNames = form.uacf7_cr_tn;
              var $tgValue = form.uacf7_cr_field_val;
              var $tgRedirectionUrl = form.uacf7_cr_redirect_to_url;
              var $x = 0;
              jQuery($tgNames).each(function () {
                var inputVal = jQuery(
                  ".uacf7-form-" + formId + ' [name="' + $tgNames[$x] + '"]'
                ).val();
                if (
                  jQuery(
                    ".uacf7-form-" + formId + ' [name="' + $tgNames[$x] + '"]'
                  ).is("input[type='radio']")
                ) {
                  var inputVal = jQuery(
                    ".uacf7-form-" +
                      formId +
                      ' [name="' +
                      $tgNames[$x] +
                      '"]:checked'
                  ).val();
                }
                if (
                  jQuery(
                    ".uacf7-form-" + formId + ' [name="' + $tgNames[$x] + '"]'
                  ).is("input[type='checkbox']")
                ) {
                  var inputVal = jQuery(
                    ".uacf7-form-" +
                      formId +
                      ' [name="' +
                      $tgNames[$x] +
                      '"]:checked'
                  ).val();
                }
                var conditionVal = $tgValue[$x];
                if (inputVal == conditionVal) {
                  if ($tgRedirectionUrl[$x] != "") {
                    if (
                      typeof uacf7_global_tag_support === "function" &&
                      uacf7TagSupport == "on"
                    ) {
                      uacf7_global_tag_support(
                        event,
                        $tgRedirectionUrl[$x],
                        formTarget.target
                      );
                    } else {
                      if (formTarget.target) {
                        window.open($tgRedirectionUrl[$x], "_blank");
                      } else {
                        location.href = $tgRedirectionUrl[$x];
                      }
                    }
                  }
                }
                $x++;
              });
            });
          }
        },
        !1
      );
    }
  });
})(jQuery);
