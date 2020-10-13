_Vanilla Playing Card_ is a easy way to impleent playing cards on web pages.

## Features

-   _Simple_ interface to modify the component to your liking
-   _Lightweight_, since the component doesn't depend on any libraries
-   _Framework agnostic_

## Demo

[Link to demo](https://matsuuu.github.io/playing-card/)

## Install

```bash
npm install playing-card --save
```

## Usage

```html
<style>
    playing-card {
        --card-size: 5rem;
        background: linear-gradient(#e66465, #9198e5);
    }
</style>

<playing-card rank="10" suit="D" flippable></playing-card>

<script type="module">
    import 'playing-card';
</script>
```

## Properties

| Name  | Type   | Values                       | Description                                                                                           |
| ----- | ------ | ---------------------------- | ----------------------------------------------------------------------------------------------------- |
| Style | String | `Flippable` & `Peekable`     | Determines the type of card and it's interactions                                                     |
| Rank  | String | `A`, `2-10`, `J`, `Q` or `K` | Determines the rank of the playing card                                                               |
| Suit  | String | `D`, `H`, `C` or `S`         | Determines the suit of the playing card. Characters are short from Diamonds, Hearts, Clubs and Spades |

## Styling

#### Size

The size of the card can be easily modified with a css variable

```css
playing-card {
    --card-size: 4rem;
}
```

#### Background

The background, or so called "Card back" can be whatever you want. It follows the regular `background` properties of a HTML element

```css
playing-card {
    background: green center/50% no-repeat url('https://image.flaticon.com/icons/png/512/8/8817.png');
}
```

## Contributing

Currently most of the development is being done by [Matsuuu](https://github.com/Matsuuu), but the following fields could use contributions:

-   A11y
-   Mobile-support
-   Optimizing the SVG's
