/**
 * All unit tests for the helpers module
 *
 * @author Jan Petzold
 */
describe("Unit tests for helpers module", function() {
        it("check if hidden property of object is reverted correctly", function() {
            var obj = {
                hidden : true
            };
            var convertedObj = app.helpers.triggerHidden(obj);
            expect(convertedObj.hidden).toEqual(false);
        });
        it("check sleep and benchmarking functionality", function() {
            app.helpers.simpleBenchmark.start();
            app.helpers.sleep(1000);
            app.helpers.simpleBenchmark.stop();
            expect(app.helpers.simpleBenchmark.stop()).toBeGreaterThan(999);
            expect(app.helpers.simpleBenchmark.stop()).toBeLessThan(1100);
        });
        it("check status code calculation based on width and X position", function() {
            expect(app.helpers.getStatusFromOffset(1024, 33)).toEqual(0);
            expect(app.helpers.getStatusFromOffset(1920, 641)).toEqual(1);
            expect(app.helpers.getStatusFromOffset(640, 426)).toEqual(1);
            expect(app.helpers.getStatusFromOffset(640, 427)).toEqual(2);
            expect(app.helpers.getStatusFromOffset(800, 801)).toEqual(2);
    });
});
