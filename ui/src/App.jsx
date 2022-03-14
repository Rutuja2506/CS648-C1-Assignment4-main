/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-no-target-blank */
/* eslint "react/react-in-jsx-scope": "off" */
/* globals React ReactDOM */
/* eslint "react/jsx-no-undef": "off" */

const cNode = document.getElementById('contents');

function ProductTable(props) {
  // eslint-disable-next-line max-len
  const productRows = props.products.map(product => <ProductRow key={product.id} product={product} />);
  const borderedStyle = { border: '1px solid black', padding: 6 };
  return (
    <table style={{ borderCollapse: 'collapse' }}>
      <thead>

        <tr>
          <th style={borderedStyle}>Name</th>
          <th style={borderedStyle}>Price</th>
          <th style={borderedStyle}>Category</th>
          <th style={borderedStyle}>ImageURL</th>
        </tr>
      </thead>
      <tbody>
        {productRows}
      </tbody>
    </table>
  );
}

class ProductAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.productAdd;
    const product = {
    // eslint-disable-next-line max-len
      name: form.name.value, price: form.price.value ? form.price.value.slice(1) : "", category: form.category.value, imageURL: form.imageURL.value,
    };
    // eslint-disable-next-line react/destructuring-assignment
    this.props.createProduct(product);
    form.name.value = '';
    form.price.value = '$';
    form.category.value = '';
    form.imageURL.value = '';
  }

  render() {
    return (
      <form name="productAdd" onSubmit={this.handleSubmit}>
        <section>
          <h2>Add a new product to inventory</h2>
          <div>
            Name
            <input type="text" name="name" />
          </div>
          <div>
            Price
            <input type="text" name="price" defaultValue="$" />
          </div>
          <div>
            Category
            <select id="list" name="category">
              <option value="Shirts">Shirts</option>
              <option value="Jeans">Jeans</option>
              <option value="Jackets">Jackets</option>
              <option value="Sweaters">Sweaters</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
          <div>
            Image URL
            <input type="text" name="imageURL" />
          </div>

        </section>
        <section>
          <button type="submit">Add Product</button>
        </section>

      </form>
    );
  }
}
function ProductRow(props) {
  const borderedStyle = { border: '1px solid black', padding: 4 };
  const { product } = props;
  return (
    <tr>
      <td style={borderedStyle}>{product.name}</td>
      <td style={borderedStyle}>
        $
        {product.price}
      </td>
      <td style={borderedStyle}>{product.category}</td>
      <td style={borderedStyle}><a href={product.imageURL} target="_blank">View</a></td>
    </tr>
  );
}
class ProductList extends React.Component {
  constructor() {
    super();
    this.state = { products: [] };
    this.createProduct = this.createProduct.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query {
        productlist {
        _id
          id
          name
          price
          category
          imageURL
        }
      }`;
    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const body = await response.text();
    const result = JSON.parse(body);
    this.setState({ products: result.data.productlist });
  }

  async createProduct(product) {
    const query = `mutation addprod($product: productInput!) {
            addprod(product: $product) {
                id
            }
          }`;
    // eslint-disable-next-line no-unused-vars
    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { product } }),
    });

    this.loadData();
  }

  render() {
    return (

      <div>
        <h1>My Company Inventory</h1>
        <h2>Showing all available products </h2>
        <hr />
        <ProductTable products={this.state.products} />
        <hr />
        <ProductAdd createProduct={this.createProduct} />
      </div>
    );
  }
}


ReactDOM.render(<ProductList />, cNode);
