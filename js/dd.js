(function($) {
    $.fn.dropdown = function() {

        return this.each(function() {

            var $dd = $(this);
            var $placeholder = $dd.children('span');
            var $input = $dd.children('input');
            var $list = $dd.find('.dropdown');
            var $opts = $dd.find('.dropdown > li');
            var $first = $opts.first();
            var $firstText = $first.text();
            var $firstVal = $first.data('value');

            $first.addClass('selected');
            $placeholder.text($firstText);
            $input.val($firstVal);

            $(document).on('click', $dd, function(event) {
                event.preventDefault();
                $dd.toggleClass('active');
            });

            $opts.on('click', function(event) {
                event.preventDefault();
                var $opt = $(this);
                var $val = $opt.data('value');
                var $text = $opt.text();

                $placeholder.text($text);
                $input.val($val);

                if (!$opt.hasClass('selected')) {
                    $opts.removeClass('selected');
                    $opt.addClass('selected');
                }
            });

            $(document).on('click', function(event) {
                if ($(event.target).closest($dd).length === 0) {
                    $dd.removeClass('active');
                }
            });
        });
    };

}(jQuery));
