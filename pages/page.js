import Wd from '../core/wd';

export default class Page {

	// Page elements
	closeNeedHelpButton() { return '#close'; }


	// Page actions
	open(path) {
		Wd.open(path);
	}
}
