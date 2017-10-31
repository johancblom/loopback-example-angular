describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      expect ([1,2,3]).toContain(1);
      expect([1,2,3]).not.toContain(0);
    })
  })
});
