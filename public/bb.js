Number.prototype.pad = function () {
    let size = 2;
    var s = String(this);
    while (s.length < (size || 2)) { s = "0" + s; }
    return s;
}

let api = {
    id: 'content',
    size: [3, 3],
    max: 2,
    interval: null,
    template: ([a, b]) => `<div class="item pristine" solution="${a * b}">
                                <div class="values">
                                    ${a} x ${b}
                                </div>
                                <div class="solution">
                                    <input class="solutionInput">
                                </div>
                            </div>`,
    target: () => document.getElementById(api.id),
    statusBar: () => document.getElementById('status'),
    random: () => (Math.random() * api.max >> 0) + 1,
    next: (el) => {
        var universe = document.querySelectorAll('input.solutionInput, button, select, textarea, a[href]');
        var list = Array.prototype.filter.call(universe, function (item) { return item.tabIndex >= "0" });
        var index = list.indexOf(el);
        return list[index + 1] || list[0];
    },
    get: () => {
        return [api.random(), api.random()]
    },
    draw: () => {
        let [width, height] = api.size;
        for (y = 0; y < height; y++) {
            let html = '<div class="line">';
            for (x = 0; x < width; x++) {
                html += api.template(api.get());
            }
            html += '</div>';
            api.target().innerHTML += html;
        }
    },
    delegate: () => {
        api.target().addEventListener('input', function (event) {
            let target = event.target;
            let item = target.parentElement.parentElement;
            let solution = item.getAttribute('solution');
            console.log('Event!');

            item.classList.remove('correct');
            item.classList.remove('incorrect');
            item.classList.remove('pristine');

            if (target.value == solution) {
                item.classList.add('correct');
                api.next(target).focus();
            } else {
                item.classList.add('incorrect');
            }

        }, false);
    },
    status: () => {
        let els = [...document.getElementsByClassName('item')].map(e => e.classList.contains('incorrect') || e.classList.contains('pristine'))
        let ok = !els.some(Boolean)
        return ok;
    },
    timeUnitsBetween: (startDate, endDate) => {
        let delta = Math.abs(endDate - startDate) / 1000;
        const isNegative = startDate > endDate ? -1 : 1;
        return [
            ['days', 24 * 60 * 60],
            ['hours', 60 * 60],
            ['minutes', 60],
            ['seconds', 1]
        ].reduce((acc, [key, value]) => (acc[key] = Math.floor(delta / value) * isNegative, delta -= acc[key] * isNegative * value, acc), {});
    },
    startCounter: () => {
        let begin = new Date();
        let doit = () => {
            if (api.status()) {
                clearInterval(api.interval);
                api.statusBar().innerHTML += ' Done!';
            } else {
                let t = api.timeUnitsBetween(begin, new Date())
                api.statusBar().innerHTML = `${t.hours.pad()}:${t.minutes.pad()}:${t.seconds.pad()}`;
            }
        }
        api.interval = setInterval(doit, 1000);
    },
    gotofirst: () => {
        [...document.querySelectorAll('input.solutionInput')][0].focus();
    },
    clean: () => {
        clearInterval(api.interval);
        api.target().innerHTML = '';
    }
}


function init({ width, height, max }) {
    api.size = [width, height];
    api.max = max;
    api.clean();
    api.startCounter();
    api.draw();
    api.delegate();
    api.gotofirst();
}