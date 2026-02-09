/* @refresh reload */
import { render } from 'solid-js/web';
import './tailwind.css';
import 'solid-devtools';

const App = () => {
  return (
    <p class="text-4xl text-green-700 text-center py-20">Hello tailwind!</p>
  );
}

render(App, document.body);
