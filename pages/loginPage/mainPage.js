import Page from '../page';
import Wd from '../../core/wd';

class MainPage extends Page {

	// Page elements
	// buttons
	submitButton() { return '[type="submit"]'; }

	// Page actions
	open(path = '') {
		super.open(path);
	}

}

export default new MainPage();
