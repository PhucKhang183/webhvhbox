(function ($) {
  "use strict";
  $.fn.tawcvs_variation_swatches_form = function () {
    return this.each(function () {
      var $form = $(this),
        clicked = null,
        selected = [];
      $form
        .addClass("swatches-support")
        .on("click", ".swatch", function (e) {
          e.preventDefault();
          var $el = $(this),
            $select = $el.closest(".value").find("select"),
            attribute_name =
              $select.data("attribute_name") || $select.attr("name"),
            value = $el.data("value");
          $select.trigger("focusin");
          if (!$select.find('option[value="' + value + '"]').length) {
            $el.parent().siblings().find(".swatch").removeClass("selected");
            $select.val("").change();
            $form.trigger("tawcvs_no_matching_variations", [$el]);
            return;
          }
          clicked = attribute_name;
          if (selected.indexOf(attribute_name) === -1) {
            selected.push(attribute_name);
          }
          if ($el.hasClass("selected")) {
            $select.val("");
            $el.removeClass("selected");
            delete selected[selected.indexOf(attribute_name)];
          } else {
            $el.addClass("selected");
            $el.parent().siblings().find(".swatch").removeClass("selected");
            $select.val(value);
          }
          $select.change();
        })
        .on("click", ".reset_variations", function () {
          $(this)
            .closest(".variations_form")
            .find(".swatch.selected")
            .removeClass("selected");
          selected = [];
          $(".variations_form select.single-attribute-select").each(
            function () {
              var $select = $(this),
                value = $select.find("option:last-child").val();
              $select.val(value);
              $select.change();
            }
          );
        })
        .on("tawcvs_no_matching_variations", function () {
          window.alert(
            wc_add_to_cart_variation_params.i18n_no_matching_variations_text
          );
        });
    });
  };
  $(function () {
    $(".variations_form").tawcvs_variation_swatches_form();
    $(document.body).trigger("tawcvs_initialized");
  });
  $(".variation-selector select").change(function () {
    showAttrDescription();
  });
  $("select[data-attribute_name]").change(function () {
    showSummary();
  });
  $("input#curr-single-price").change(function () {
    showSummary();
  });
  $("body").on(
    "nPackShippingPriceChange",
    "input#curr-shipping-price",
    function (event) {
      showSummary();
    }
  );
  $("#shipping-country").on("change", function () {
    showSummary();
  });
  showSummary();
  showAttrDescription();
})(jQuery);
function showAttrDescription() {
  jQuery(".variations_form").each(function () {
    var $swatches = jQuery(".tawcvs-swatches");
    $swatches.find(".swatch").removeClass("out-of");
    $swatches.each(function () {
      var $select = jQuery(this).prev().find("select");
      jQuery(this)
        .find(".swatch")
        .each(function () {
          if (
            $select.find(
              'option[value="' + jQuery(this).attr("data-value") + '"]'
            ).length <= 0
          ) {
            jQuery(this).addClass("out-of");
          }
        });
      var $attr_name = jQuery(this).attr("data-attribute_name"),
        $selecdet_term = jQuery(this).find(".selected").attr("data-value"),
        $description = "";
      if ($selecdet_term !== undefined) {
        $description = jQuery(this)
          .parent()
          .find(".swatch-description--" + $selecdet_term)
          .html();
      }
      jQuery(
        'span.description-wrapper[data-attribute_name="' + $attr_name + '"]'
      ).html($description);
    });
  });
}
function showSummary() {
  var $summaryText = "",
    $samleRequestModalAttrText = "",
    $samleRequestModalAttrHiddenVal = "";
  jQuery("select[data-attribute_name]").each(function () {
    var $this = jQuery(this),
      $ID = $this.attr("ID"),
      $attr_name = $this.attr("data-attribute_name"),
      $selecdet_term = $this.children("option:selected").val(),
      $description = $this
        .parent()
        .parent()
        .find(".swatch-description--" + $selecdet_term)
        .html(),
      $label = jQuery('label[for="' + $ID + '"]').text(),
      $rightCollText = "",
      $checkbox = "";
    $label = $label.split(":");
    if (!$selecdet_term) {
      return !0;
    }
    $summaryText +=
      $attr_name === "attribute_pa_quantity"
        ? '<div class="row attr-summary-row accent">'
        : '<div class="row attr-summary-row">';
    $summaryText +=
      '<div class="col-sm-6 attr-summary-left">' +
      $label[0] +
      ':</div><div class="col-sm-6 attr-summary-right text-right">';
    if (typeof $description !== "undefined" && $description.length) {
      $rightCollText = $description;
    } else {
      $rightCollText = $this.children("option:selected").text();
    }
    $summaryText += $rightCollText;
    $summaryText += "</div></div>";
    if (
      $attr_name !== "attribute_pa_quantity" &&
      $attr_name !== "attribute_pa_branding_position" &&
      $attr_name !== "attribute_pa_fitting-size"
    ) {
      $checkbox =
        '<input type="checkbox" name="favorites[]" value="' +
        $label[0] +
        '" title="Select if this is favorite faeture">&nbsp;&nbsp;&nbsp;';
      $samleRequestModalAttrText +=
        "<label><dt>" + $checkbox + $label[0] + ":</dt>";
      $samleRequestModalAttrText += "<dd>" + $rightCollText + "</dd></label>";
      $samleRequestModalAttrHiddenVal +=
        $label[0] + ": " + $rightCollText + "||#||";
    }
  });
  $summaryText += pricesSummary();
  if ($summaryText.length) {
    $summaryText =
      '<h5 class="text-center">Summary of your choices</h5>' + $summaryText;
    jQuery("#attributes-summary").html($summaryText);
    jQuery("#attributes-summary p span").remove();
  }
  if ($samleRequestModalAttrText.length) {
    jQuery(
      "div.attribute-explanation-question_form_modal div.row.product div.attributes dl.variation"
    ).html($samleRequestModalAttrText);
    jQuery("#selected-attributes-for-sample-request").val(
      $samleRequestModalAttrHiddenVal
    );
  }
}
function pricesSummary() {
  var $summaryPriceText = "",
    $quantity = Number(jQuery("#pa_quantity option:selected").val()),
    $shippingCountry = jQuery("#shipping-country option:selected").text(),
    $singlePrice = Number(jQuery("input#curr-single-price").val()),
    $shippingPrice = Number(jQuery("input#curr-shipping-price").val());
  if ($singlePrice) {
    $summaryPriceText += '<div class="row attr-summary-row accent">';
    $summaryPriceText += '<div class="col-sm-8 attr-summary-left">';
    $summaryPriceText += "Unit Cost";
    $summaryPriceText += ":</div>";
    $summaryPriceText += '<div class="col-sm-4 attr-summary-right text-right">';
    $summaryPriceText += "€" + $singlePrice.toFixed(2);
    $summaryPriceText += "</div></div>";
    $summaryPriceText += '<div class="row attr-summary-row accent">';
    $summaryPriceText += '<div class="col-sm-9 attr-summary-left">';
    $summaryPriceText += "Total (excl. VAT & shipping cost)";
    $summaryPriceText += ":</div>";
    $summaryPriceText += '<div class="col-sm-3 attr-summary-right text-right">';
    $summaryPriceText += "€" + ($singlePrice * $quantity).toFixed(2);
    $summaryPriceText += "</div></div>";
    if ($shippingPrice) {
      $summaryPriceText += '<div class="row attr-summary-row accent">';
      $summaryPriceText += '<div class="col-sm-9 attr-summary-left">';
      $summaryPriceText += "Standard delivery shipping cost";
      $summaryPriceText += ":";
      $summaryPriceText +=
        '<br><span class="dest">(delivery to ' +
        $shippingCountry +
        ")</span></div>";
      $summaryPriceText +=
        '<div class="col-sm-3 attr-summary-right text-right">';
      $summaryPriceText += "€" + $shippingPrice.toFixed(2);
      $summaryPriceText += "</div></div>";
    }
  }
  return $summaryPriceText;
}
