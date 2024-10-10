class Parallax{

    constructor(time, url, element, classStart){
        this.element = element;
        this.element.classList.add(`${classStart}`);
        this.element.style.backgroundImage = `url('${url}')`;
        this.element.style.animationDuration = time;
    }
}