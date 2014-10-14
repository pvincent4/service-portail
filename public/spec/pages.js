describe('portail homepage', function() {
    it('should have a title', function() {
	browser.ignoreSynchronization = true;
	browser.get('http://localhost:9292/portail/');

	// element(by.css('#username')).sendKeys('erasme');
	// element(by.css('#password')).sendKeys('toortoor');
	// element(by.css('.btn-submit')).click();

	expect(browser.getTitle()).toEqual('Laclasse.com');
    }, 3000, 'Toujours pas chargé');
});
