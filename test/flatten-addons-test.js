const flattenAddons = require('../lib/flatten-addons');
const { expect } = require('chai');

describe('flatten-addons', () => {
  it('empty array returns empty array', () => {
    expect(flattenAddons([])).to.deep.equal([]);
  });

  it('should return addon given an addon', () => {
    const unestedAddon = {
      name: 'foo',
      root: 'tmp',
      addons: [],
    };

    expect(flattenAddons([unestedAddon])).to.deep.equal([unestedAddon]);
  });

  it('should flatten single nested addon', () => {
    const addon = {
      name: 'foo',
      root: 'tmp',
      addons: [
        {
          name: 'bar',
          root: 'tmp/bar',
          addons: [],
        },
      ],
    };

    expect(flattenAddons([addon])).to.deep.equal([
      addon,
      { name: 'bar', root: 'tmp/bar', addons: [] },
    ]);
  });

  it('should flatten double nested addon', () => {
    const addon = {
      name: 'foo',
      root: 'tmp',
      addons: [
        {
          name: 'bar',
          root: 'tmp/bar',
          addons: [
            {
              name: 'foo-bar',
              root: 'tmp',
            },
          ],
        },
      ],
    };

    expect(flattenAddons([addon])).to.deep.equal([
      addon,
      {
        name: 'bar',
        root: 'tmp/bar',
        addons: [{ name: 'foo-bar', root: 'tmp' }],
      },
      { name: 'foo-bar', root: 'tmp' },
    ]);
  });

  it('should flatten multiple addons with nested addons', () => {
    const addon = {
      name: 'foo',
      root: 'tmp',
      addons: [
        {
          name: 'bar',
          root: 'tmp',
          addons: [{ name: 'bar-foo', root: 'tmp' }],
        },
        {
          name: 'foobar',
          root: 'tmp',
          addons: [
            {
              name: 'foo-bar',
              root: 'tmp',
              addons: [
                {
                  name: 'foo-bar-foo-bar',
                  root: 'tmp',
                },
              ],
            },
          ],
        },
      ],
    };

    expect(flattenAddons([addon])).to.deep.equal([
      addon,
      {
        name: 'bar',
        root: 'tmp',
        addons: [{ name: 'bar-foo', root: 'tmp' }],
      },
      { name: 'bar-foo', root: 'tmp' },
      {
        name: 'foobar',
        root: 'tmp',
        addons: [
          {
            name: 'foo-bar',
            root: 'tmp',
            addons: [{ name: 'foo-bar-foo-bar', root: 'tmp' }],
          },
        ],
      },
      {
        name: 'foo-bar',
        root: 'tmp',
        addons: [{ name: 'foo-bar-foo-bar', root: 'tmp' }],
      },
      {
        name: 'foo-bar-foo-bar',
        root: 'tmp',
      },
    ]);
  });
});
