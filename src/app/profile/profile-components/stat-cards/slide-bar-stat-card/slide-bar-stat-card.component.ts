import { AfterViewInit, Component, ElementRef, HostBinding, Input, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-slide-bar-stat-card',
  standalone: true,
  imports: [],
  templateUrl: './slide-bar-stat-card.component.html',
  styleUrl: './slide-bar-stat-card.component.scss',
  animations: [
    trigger("slideToValue", [
      state("slideIn",
        style({ transform: "translateX({{percentage}})" }),
        { params: {percentage: 0}}
      ),
      transition(":enter", [
        animate("1000ms 2000ms ease-out")
      ])
    ])
  ]
})
export class SlideBarStatCardComponent implements OnInit, AfterViewInit {
  constructor(private elementRef: ElementRef) { }

  @Input() title =  "slide-bar-stat-title"
  @Input() value = "stat-value"
  @Input() subvalue = "stat-subvalue"
  @Input() statPercentage = .5
  @Input() unit = ""

  num = Number(this.value)
  counter = new BehaviorSubject<string>("0")

  cardTitleFontSize: string = document.documentElement.style.getPropertyValue("--card-value-font-size")


  ngOnInit(): void {
  }
  
  ngAfterViewInit() {
    if (!isNaN(Number(this.value))) {
      this.count(Number(this.value), 200)
    } else {
      setTimeout( () => this.renderText(this.value, 2000, 10), 2000)
    }
  }

  count(total: number, ms: number) {
    let start = 0

    if (start == total) {
      return;
    }

    let incrementTime = (ms / total);

    let timer = setInterval(() => {
      start += 1
      this.counter.next(String(start) + this.num.toString().substring(3))
      if (start == total) {
        clearInterval(timer)
      }
    }, incrementTime)
  }

  renderText(str: string, ms: number, speed: number) {
    const ne = this.elementRef.nativeElement;
    let nums = Array.from(Array(10).keys()).map(i => i.toString())
    let lowerChars = Array.from(Array(26).keys()).map(i => i + 65).map(i => String.fromCharCode(i))
    let upperChars = Array.from(Array(26).keys()).map(i => i + 97).map(i => String.fromCharCode(i))
    
    let randCharArray =  [...nums, ...lowerChars, ...upperChars]

    function randomCharacter() {
      let randomNum = Math.floor(Math.random() * randCharArray.length)
      return randCharArray[randomNum]
    }

    let start = 0
    let charsLeftToRand = Array.from(Array(str.length).keys())

    let incrementTime = (ms / (speed * str.length));

    let strEdit = Array(str.length).map(i => randomCharacter())

    let timer = setInterval(() => {
      start += 1
      if (start % (speed) == 0) {
        let i = Math.floor(Math.random() * charsLeftToRand.length)
        let c = charsLeftToRand[i]
        charsLeftToRand.splice(i, 1)
        strEdit[c] = str[c]
      }
      strEdit[charsLeftToRand[Math.floor(Math.random() * charsLeftToRand.length)]] = randomCharacter()
      this.counter.next(strEdit.join(""))
      if (this.counter.getValue().length > 10)
        ne.style.setProperty("--card-value-font-size", 50 - this.counter.getValue().length/2 + "px")

      if (start == (speed * str.length)) {
        clearInterval(timer)
      }
    }, incrementTime)
  }
}
