window.onload = function () {
    two_replace_backgrounds();
};

window.addEventListener('elementor/frontend/init', () => {
    elementorFrontend.hooks.addAction('frontend/element_ready/global', function ($scope) {
        addTwoElementorElementClass($scope);
        two_replace_backgrounds($scope.get(0));
    });
});

function two_replace_backgrounds(elementor_elements = false) {
    let two_elements_list;

    if (!elementor_elements) {
        two_elements_list = getTwoElementsList();
    } else {
        two_elements_list = Array.from(elementor_elements.querySelectorAll('.two_elementor_element'));
    }

    if (!two_elements_list.length) {
        console.warn('No elements found with the class "two_elementor_element"');
        return;
    }

    for (const elem of two_elements_list) {
        const style = getComputedStyle(elem, null);
        const bg_image = style.backgroundImage;

        if (!bg_image || bg_image === 'none' || bg_image.includes('none') || !bg_image.includes('url(')) {
            continue;
        }

        const url = bg_image.slice(4, -1).replace(window['two_svg_placeholder'], '');

        if (!url) {
            continue;
        }

        addTwoBgClass(elem);
        addLazyClass(elem);
        removeTwoElementorElementClass(elem);
        setDataBgMultiAttribute(elem, url);
    }

    if (typeof two_lazyLoadInstance === 'undefined') {
        window.two_lazyLoadInstance = new LazyLoad({
            'callback_applied': function (element, instance) {
                const settings = instance._settings;
                const bgDataValue = element.getAttribute('data-' + settings.data_bg_multi);

                if (!bgDataValue) {
                    return;
                }

                if (getComputedStyle(element).getPropertyValue('background-image') !== bgDataValue) {
                    const style = element.getAttribute('style');
                    style += `background-image: ${bgDataValue} !important;`;
                    element.setAttribute('style', style);
                }
            }
        });
    } else {
        two_lazyLoadInstance.update();
    }
}

function addTwoElementorElementClass($scope) {
    $scope.find('*').addClass('two_elementor_element');
}

function getTwoElementsList() {
    return document.querySelectorAll('*:not(br):not(hr):not(iframe):not(pre)');
}

function addTwoBgClass(elem) {
    elem.classList.add('two_bg');
}

function addLazyClass(elem) {
    const lazyClass = 'two-lazy-load';
    if (!elem.classList.contains(lazyClass)) {
        elem.classList.add(lazyClass);
    }
}

function removeTwoElementorElementClass(elem) {
    elem.classList.remove('two_elementor_element');
}


