jQuery(document).ready(function () {
  jQuery(".uacf7-step").each(function () {
    $next_btn = jQuery(this).attr("next-btn-text");
    $prev_btn = jQuery(this).attr("prev-btn-text");
    if ($next_btn != "") {
      jQuery(".uacf7-next", this).text($next_btn);
    }
    if ($prev_btn != "") {
      jQuery(".uacf7-prev", this).text($prev_btn);
    }
  });
  jQuery(".wpcf7-form").each(function () {
    jQuery(".steps-step a.uacf7-btn-active", this)
      .parent()
      .addClass("step-complete");
    jQuery(".steps-step a", this).on("click", function () {
      jQuery(this).parent().addClass("step-complete");
      jQuery(this).parent().prevAll(".steps-step").addClass("step-complete");
      jQuery(this).parent().nextAll(".steps-step").removeClass("step-complete");
    });
  });
});
