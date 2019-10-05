
class Wd {
	get defaultWaitTime() { return browser.config.waitforTimeout }

	open(path) {
		browser.url(path);
	}

	refreshPage() {
		browser.refresh();
	}

	click(selector, waitTime = this.defaultWaitTime) {
		$(selector).waitForDisplayed(waitTime);
		$(selector).waitForEnabled(waitTime);
		$(selector).click();
	}

	scrollIntoView(selector) {
		$(selector).scrollIntoView();
	}

	clearField(selector, waitTime = this.defaultWaitTime) {
		$(selector).waitForDisplayed(waitTime);
		$(selector).click();
		browser.pause(500);
		$(selector).clearValue();
		browser.pause(500);
		$(selector).clearValue();
		browser.pause(500);
	}

	setValue(selector, value, waitTime = this.defaultWaitTime) {
		$(selector).waitForDisplayed(waitTime);
		$(selector).click();
		browser.pause(500);
		$(selector).clearValue();
		browser.pause(500);
		$(selector).setValue(value);
		browser.pause(500);
	}

	waitForDisplayed(selector, waitTime = this.defaultWaitTime) {
		$(selector).waitForDisplayed(waitTime);
	}

	waitForNotVisible(selector, waitTime = this.defaultWaitTime) {
		$(selector).waitForDisplayed(waitTime, true);
	}

	waitForEnabled(selector, waitTime = this.defaultWaitTime) {
		$(selector).waitForEnabled(waitTime);
	}

	getElement(selector, waitTime = this.defaultWaitTime) {
		this.waitForDisplayed(selector, waitTime);
		return browser.$(selector);
	}

	getElements(selector, waitForDisplayed = true, waitTime = this.defaultWaitTime) {
		waitForDisplayed && this.waitForDisplayed(selector, waitTime);
		return browser.$$(selector);
	}

	getText(selector, waitTime = this.defaultWaitTime) {
		$(selector).waitForDisplayed(waitTime);
		return $(selector).getText();
	}

	getValue(selector, waitTime = this.defaultWaitTime) {
		$(selector).waitForDisplayed(waitTime);
		return $(selector).getValue();
	}

	getAttribute(selector, attributeName, waitTime = this.defaultWaitTime) {
		$(selector).waitForExist(waitTime);
		return $(selector).getAttribute(attributeName);
	}

	moveToObject(selector, waitTime = this.defaultWaitTime) {
		$(selector).waitForDisplayed(waitTime);
		$(selector).moveToObject();
	}

	getElementsTextArray(selector, waitTime = this.defaultWaitTime) {
		$(selector).waitForDisplayed(waitTime);
		let elements = browser.$$(selector);
		let result = [];
		elements.forEach( element => result.push(element.getText()));
		return result;
	}

	isPresent(selector, waitTime = this.defaultWaitTime) {
		$(selector).waitForDisplayed(waitTime);
		$(selector).waitForExist(waitTime);
		return $(selector).isExisting();
	}

	elementIsDisplayed(selector) {
		return $(selector).isDisplayed();
	}

	elementIsSelected(selector) {
		return $(selector).isSelected();
	}

	pressEnterKey() {
		browser.keys('\uE007');
	}

	setAttributeForUploading(selector, waitTime = this.defaultWaitTime) {
		$(selector).waitForExist(waitTime);
		browser.execute(`let avatarButton = document.querySelector('${selector}');avatarButton.style.display="block"`);
	}

	wait(time) {
		browser.pause(time * 1000);
	}
}

export default new Wd();
