(function($) {
    $.extend(true, window, {
        "Slick": {
            "AutoColumnSize": AutoColumnSize
        }
    });

    function AutoColumnSize() {

        var grid, $container, context;

        function getDefaultFontSize() {
            var defaultFontSize = 13;
            if (localStorage['TC_MISC']) {
                var settings = JSON.parse(localStorage['TC_MISC'])['fontSize'];
                switch (settings) {
                    case 1: // small
                        defaultFontSize = 12;
                        break;
                    case 2: // normal
                        defaultFontSize = 13;
                        break;
                    case 3: // large
                        defaultFontSize = 16;
                        break;
                }
            }
            return defaultFontSize;
        }

        function init(_grid) {
            grid = _grid;
            $container = $(grid.getContainerNode());
            context = document.createElement("canvas").getContext("2d");

            $container.on("dblclick", ".slick-resizable-handle", reSizeColumn);
        }

        // *************************************************************************************************************
        // MA - READ THIS FIRST
        // THIS IS BASED ON https://github.com/naresh-n/slickgrid-column-data-autosize but nearly fully changed
        // THIS SHOULD BE USED FOR MOBILE ONLY
        // Basic attempt to resize slick grid column widths to only fit the data, and therefore, have it working on
        // mobile with minimum needed space, and auto-adjustment between different markets.
        // *************************************************************************************************************

        function resizeAllColumns() {

            var elHeaders = $container.find(".slick-header-column");
            var allColumns = grid.getColumns();

            elHeaders.each(function(index, el) {
                var columnDef = $(el).data('column');
                var column = allColumns[grid.getColumnIndex(columnDef.id)];
                var font = getFontGivenColumn(columnDef);
                // MA for mobile, due to the small size of the screen & for the wide variation in the name column, ignore the top 4 "outliers"
                // and pick max width of fifth. this is needed to prevent a very long company name from eating the whole screen size.
                var autoSizeWidth = getMaxColumnTextWidth(columnDef, font) + 5;
                if(column.mobileWidth && column.mobileWidth > autoSizeWidth){
                    autoSizeWidth = column.mobileWidth;
                }

                if (column.hadAnnotation) {
                    autoSizeWidth += 12;
                }
                column.width = autoSizeWidth;
            });
            grid.setColumns(allColumns);
            grid.onColumnsResized.notify();
        }

        function getFontGivenColumn(columnDef) {
            var defaultFontSize = getDefaultFontSize();
            return columnDef.id === 'name' ? defaultFontSize + 'px DroidSansArabic' : 'bold ' + defaultFontSize + 'px Arial';
        }

        //Abu5, this function will be used for the desktop only (and not the mobile)
        function reSizeColumn(e) {
            var headerEl = $(e.currentTarget).closest('.slick-header-column');
            var columnDef = headerEl.data('column');

            if (!columnDef || !columnDef.resizable) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            var headerWidth = getElementWidth(headerEl[0]);
            var colIndex = grid.getColumnIndex(columnDef.id);
            var allColumns = grid.getColumns();
            var column = allColumns[colIndex];

            // Abu5, hardcoded fonts, to get a closest text width
            var font = getFontGivenColumn(columnDef);
            var autoSizeWidth = Math.max(headerWidth, getMaxColumnTextWidth(columnDef, font)) + 4;

            if (autoSizeWidth !== column.width) {
                column.width = autoSizeWidth;
                grid.setColumns(allColumns);
                grid.onColumnsResized.notify();
            }
        }

        function getElementWidth(element) {
            var width, clone = element.cloneNode(true);
            clone.style.cssText = 'position: absolute; visibility: hidden;right: auto;text-overflow: initial;white-space: nowrap;';
            element.parentNode.insertBefore(clone, element);
            width = clone.offsetWidth;
            clone.parentNode.removeChild(clone);
            return width;
        }

        function getMaxColumnTextWidth(columnDef, font) {
            var data = grid.getData();
            if (Slick.Data && data instanceof Slick.Data.DataView) {
                data = data.getFilteredItems();
            }
            setContextFont(font);
            var textWidths = [];
            for (var i = 0; i < data.length; i++) {
                var text = data[i][columnDef.field];
                if (columnDef.id == 'symbol') {
                    text = splitSymbol(text)[0]; // for symbol, just take the symbol
                } else if (columnDef.id == 'name') {
                    text = text.replace("المؤشر العام", ""); // for name, just trim general index long name
                }else if (columnDef.id == 'changePercent') { // Column size is less than  its content because we don't handle "%" & arrows size .
                    text ="changePercent";
                }
                else if (columnDef.cssClass == 'eye') { // Column size is more large than its content , we set 'eye' to have space close to eye image .
                    text ="eye";
                }
                else if (!isNaN(parseFloat(text)) && isFinite(text)) {
                    var integer = text === parseInt(text, 10); // for numbers, format them in order to get correct size
                    text = formatMoney(text, integer ? 0 : 3);
                }
                textWidths.push(getElementWidthUsingCanvas(text));
            }
            textWidths.sort(function (a, b) {
                return a - b;
            });

            //Abu5, bug fix. When user watchlist companies are less than highestPosition
            var textWidth = 40;
            if(textWidths.length > 0) {
                var itemIndex = textWidths.length - 1;
                textWidth = textWidths[itemIndex];
            }
            return textWidth;
        }

        function splitSymbol(string) {
            var indexOfLastDot = string.lastIndexOf('.');

            var firstWord = string.substr(0, indexOfLastDot);
            var secondWord = string.substr(indexOfLastDot + 1);

            return [firstWord, secondWord];
        }

        function formatMoney(n, c = 2, d = '.', t = ','){
            var c = isNaN(c = Math.abs(c)) ? 2 : c,
                d = d == undefined ? "." : d,
                t = t == undefined ? "," : t,
                s = n < 0 ? "-" : "",
                i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
                j = (j = i.length) > 3 ? j % 3 : 0;
            return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
        }

        function setContextFont(font) {
            context.font = font;
        }

        function getElementWidthUsingCanvas(text) {
            return context.measureText(text).width;
        }

        return {
            init: init,
            resizeAllColumns: resizeAllColumns
        };
    }
}(jQuery));
