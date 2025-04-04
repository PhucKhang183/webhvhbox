jQuery(document).ready(function () {
  jQuery(".wpcf7-form").each(function () {
    var repeater_count = jQuery(this).find(".uacf7-repeater-count").val();
    var uacf7_sid = 1;
    var form_id = jQuery(this).find("input[name=_wpcf7]").val();
    var uacf7_next = jQuery(this).find(
      '.uacf7-next[data-form-id="' + form_id + '"]'
    );
    var uacf7_prev = jQuery(this).find(
      '.uacf7-prev[data-form-id="' + form_id + '"]'
    );
    var uacf7_step = ".uacf7-step-" + form_id;
    var total_steps = jQuery(uacf7_step, this).length;
    jQuery(uacf7_step, this).each(function () {
      var $this = jQuery(this);
      $this.attr("id", form_id + "step-" + uacf7_sid);
      if (uacf7_sid == 1) {
        $this.addClass("step-start");
      }
      if (total_steps == uacf7_sid) {
        $this.addClass("step-end");
      }
      uacf7_sid++;
    });
    uacf7_prev.on("click", function (e) {
      e.preventDefault();
    });
    uacf7_next.on("click", function (e) {
      e.preventDefault();
      var $this = jQuery(this);
      uacf7_step_validation($this, uacf7_step, form_id, repeater_count);
    });
  });
  function uacf7_step_validation($this, uacf7_step, form_id, repeater_count) {
    var uacf7_current_step = jQuery($this).closest(uacf7_step);
    var uacf7_current_step_fields = uacf7_current_step
      .find(
        ".wpcf7-form-control:not(.uacf7-hidden .wpcf7-form-control, span.wpcf7-form-control)"
      )
      .map(function () {
        if (typeof this.name !== "undefined") {
          var nameIndex = this.name.indexOf("[]");
          if (nameIndex !== -1) {
            var fieldName = this.name.replace("[]", "");
          } else {
            var fieldName = this.name;
          }
          return fieldName;
        }
      })
      .get();
    if (uacf7_current_step.find(".wpcf7-form-control input").length > 0) {
      uacf7_current_step.find(".wpcf7-form-control input").each(function () {
        var Value = jQuery(
          '.wpcf7-form-control input[name="' + this.name + '"]:checked'
        ).val();
        if (jQuery(this).is("input[type='checkbox']")) {
          if (typeof Value == "undefined") {
            var checkboxName = this.name.replace("[]", "");
            uacf7_current_step_fields.push(checkboxName);
          }
        } else {
          if (typeof Value == "undefined") {
            var checkboxName = this.name;
            uacf7_current_step_fields.push(checkboxName);
          }
        }
      });
    }
    function uacf7_onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
    var uacf7_current_step_fields =
      uacf7_current_step_fields.filter(uacf7_onlyUnique);
    var uacf7_form_ids = "";
    var fields_to_check_serialized = jQuery(uacf7_current_step)
      .find(".wpcf7-form-control")
      .serialize();
    if (
      jQuery(uacf7_current_step).find(".wpcf7-form-control[type='file']")
        .length > 0
    ) {
      jQuery(uacf7_current_step)
        .find(".wpcf7-form-control[type='file']")
        .each(function (i, n) {
          fields_to_check_serialized +=
            "&" + jQuery(this).attr("name") + "=" + jQuery(this).val();
          if (jQuery(this)[0].files.length > 0) {
            var file_size = jQuery(this)[0].files[0].size;
            fields_to_check_serialized +=
              "&" + jQuery(this).attr("name") + "_size=" + file_size;
          }
        });
    }
    var validation_fields = [];
    for (let i = 0; i < uacf7_current_step_fields.length; i++) {
      if (uacf7_current_step_fields[i] != "") {
        var type = jQuery("[name=" + uacf7_current_step_fields[i] + "]");
        if (typeof type[0] === "undefined") {
          type = jQuery('[name="' + uacf7_current_step_fields[i] + '[]"]');
        }
        type = type[0].localName;
        if (typeof repeater_count != "undefined") {
          var value = jQuery(
            "[name=" + uacf7_current_step_fields[i] + "]"
          ).val();
          var valuecheckbox = jQuery(
            "[name=" + uacf7_current_step_fields[i] + "][type='checkbox']"
          );
          if (value == "" || valuecheckbox.length > 0) {
            validation_fields.push(
              "" + type + ":" + uacf7_current_step_fields[i] + ""
            );
          }
        } else {
          validation_fields.push(
            "" + type + ":" + uacf7_current_step_fields[i] + ""
          );
        }
      }
    }
    var data =
      fields_to_check_serialized +
      "&" +
      "action=" +
      "check_fields_validation" +
      "&" +
      "form_id=" +
      form_id +
      "&" +
      "validation_fields=" +
      validation_fields +
      "&" +
      "current_fields_to_check=" +
      uacf7_current_step_fields +
      "&" +
      "ajax_nonce=" +
      uacf7_multistep_obj.nonce;
    jQuery.ajax({
      url: uacf7_multistep_obj.ajax_url,
      type: "post",
      dataType: "json",
      data: data,
      beforeSend: function () {
        jQuery($this)
          .closest(".uacf7-step")
          .find(".uacf7-ajax-loader")
          .addClass("is-active");
      },
      success: function (response) {
        jQuery($this)
          .closest(".uacf7-step")
          .find(".uacf7-ajax-loader")
          .removeClass("is-active");
        var json_result =
          typeof response === "object" ? response : JSON.parse(response);
        var $form = jQuery("form");
        clear_error_messages($form, uacf7_current_step);
        try {
          if (json_result.is_valid) {
            var curStep = jQuery($this).closest(".uacf7-step"),
              curStepBtn = curStep.attr("id"),
              nextStepWizard = jQuery(
                'div.setup-panel div a[href="#' + curStepBtn + '"]'
              )
                .parent()
                .next()
                .children("a");
            nextStepWizard.removeAttr("disabled").trigger("click");
          } else {
            jQuery.each(json_result.invalid_fields, function (i, n) {
              jQuery(n.into, "form").each(function () {
                jQuery(".wpcf7-form-control", this).addClass("wpcf7-not-valid");
                jQuery("[aria-invalid]", this).attr("aria-invalid", "true");
                jQuery(this).append(
                  '<span class="wpcf7-not-valid-tip" aria-hidden="true">' +
                    n.message +
                    "</span>"
                );
              });
            });
          }
        } catch (e) {
          console.log("error: " + e);
        }
        if (
          typeof uacf7_multistep_scroll !== "undefined" &&
          uacf7_multistep_scroll.scroll_top == "on"
        ) {
          multistep_scroll_to_top($this.parents("form"));
        }
      },
      error: function () {
        alert("Error");
      },
    });
  }
  function clear_error_messages($form, uacf7_current_step) {
    $form.removeClass("invalid");
    jQuery(".wpcf7-response-output", $form).removeClass(
      "wpcf7-validation-errors"
    );
    jQuery(".wpcf7-form-control", uacf7_current_step).removeClass(
      "wpcf7-not-valid"
    );
    jQuery("[aria-invalid]", uacf7_current_step).attr("aria-invalid", "false");
    jQuery(".wpcf7-not-valid-tip", uacf7_current_step).remove();
  }
  function multistep_scroll_to_top(element) {
    jQuery([document.documentElement, document.body]).animate(
      { scrollTop: jQuery(element).offset().top - 120 },
      500
    );
  }
  function acceptance_validation($this, uacf7_next, uacf7_step) {
    var $this = $this.closest(uacf7_step);
    var acceptance = $this.find(".wpcf7-acceptance");
    if (acceptance.length == 0) {
      return !1;
    }
    acceptance.each(function () {
      if (jQuery(this).hasClass("invert")) {
        var invert = !0;
      } else {
        var invert = !1;
      }
      if (jQuery(this).hasClass("optional")) {
        var optional = !0;
      } else {
        var optional = !1;
      }
      acceptance_validation_disabled_button(
        $this,
        invert,
        optional,
        uacf7_next,
        this.checked
      );
      jQuery(this)
        .find('input[type="checkbox"]')
        .change(function () {
          acceptance_validation_disabled_button(
            $this,
            invert,
            optional,
            uacf7_next,
            this.checked
          );
        });
    });
  }
  function acceptance_validation_disabled_button(
    $this,
    invert,
    optional,
    uacf7_next,
    checked
  ) {
    if (invert == !0 && checked == !1) {
      var next_disable = !1;
    } else if (invert == !1 && checked == !0) {
      var next_disable = !1;
    } else {
      var next_disable = !0;
    }
    if (next_disable == !0) {
      $this.find(uacf7_next).prop("disabled", !0);
    } else {
      $this.find(uacf7_next).prop("disabled", !1);
    }
    if (optional == !0) {
      $this.find(uacf7_next).prop("disabled", !1);
    }
  }
});
