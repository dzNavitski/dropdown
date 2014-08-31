;
(function($, window, document, undefined) {

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "dropdown",
        defaults = {
            firstSelected: true,
            input: true,
            onInit: function() {},
            onOpen: function() {},
            onClose: function() {},
            onChoose: function() {}
        };

    // The actual plugin constructor
    function Plugin(element, options) {
        //elements
        this.$element = $(element);
        this.nameEnabled = this.$element.data('name-enabled');
        this.valueEnabled = this.$element.data('value-enabled');
        this.placeholder = this.$element.find('.dropdown-placeholder');
        this.list = this.$element.find('.dropdown');
        this.options = this.$element.find('.dropdown-option');

        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
        this.closeDropdown();
        this.openDropdown();
        this.chooseOption();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        init: function() {
            // if input enabled
            if (this.settings.input) {
                var $inputEl = '<input class="dropdown-input" type="hidden">';

                this.$element.prepend($inputEl);
                this.input = this.$element.find('.dropdown-input');
            }

            // if first option is selected by default
            if (this.settings.firstSelected) {
                var $firstItem = this.options.first();
                var $firstItemText = $firstItem.text();

                $firstItem.addClass('is-selected');
                this.placeholder.text($firstItemText);

                //check if input option is enabled
                if (this.settings.input) {
                    //if name enabled
                    if (this.nameEnabled) {
                        var $firstItemName = $firstItem.data('name');
                        this.input.attr('name', $firstItemName);
                    }

                    //if value enabled
                    if (this.valueEnabled) {
                        var $firstItemValue = $firstItem.data('value');
                        this.input.attr('value', $firstItemValue);
                    }
                }
            }

            this.settings.onInit.call(this.$element, []);
        },
        openDropdown: function() {
            var $this = this;

            $this.$element.click(function(event) {
                if (!$this.$element.hasClass('is-active')) {
                    $this.$element.addClass('is-active');
                    $this.settings.onOpen.call($this.$element, []);
                } else {
                    $this.$element.removeClass('is-active');
                    $this.settings.onClose.call($this.$element, []);
                }
            });
        },
        closeDropdown: function() {
            var $this = this;

            $(document).on('click', function(event) {
                if ($(event.target).closest($this.$element).length === 0 && $this.$element.hasClass('is-active')) {
                    $this.$element.removeClass('is-active');
                    $this.settings.onClose.call($this.$element, []);
                }
            });
        },
        chooseOption: function() {
            var $this = this;

            $this.options.click(function(event) {
                event.stopPropagation();
                var $self = $(this);
                var $text = $self.text();

                $this.$element.removeClass('is-active');
                $this.options.removeClass('is-selected');
                $self.addClass('is-selected');
                $this.placeholder.text($text);

                //if name enabled
                if ($this.nameEnabled) {
                    var $name = $self.data('name');
                    $this.input.attr('name', $name);
                }

                //if value enabled
                if ($this.valueEnabled) {
                    var $value = $self.data('value');
                    $this.input.attr('value', $value);
                }

                $this.settings.onChoose.call($self, []);
                $this.settings.onClose.call($this.$element, []);
            });
        }
    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function(options) {
        this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });

        // chain jQuery functions
        return this;
    };

})(jQuery, window, document);
