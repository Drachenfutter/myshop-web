import React, { useEffect, useState } from 'react';
import { Alert, Button, Carousel, Col, Container, Form, Image, Modal, Row, Table } from 'react-bootstrap';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import ImageRoundedIcon from '@material-ui/icons/ImageRounded';
import SettingsBackupRestoreRoundedIcon from '@material-ui/icons/SettingsBackupRestoreRounded';
import { listImages, listProducts, saveImage, setProduct, deleteImage } from '../services/productService';
import { EditableProduct, ImageProduct, Product } from '../entity/product';
import { isLogged } from '../services/auth';
import { CONST } from '../commons/labels';
import { useHistory } from 'react-router-dom';

export default function HomePage() {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');
  const [errorModal, setErrorModal] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  const [showModalImage, setShowModalImage] = useState(false);
  const [modalImage, setModalImage]: [any, any] = useState();
  const [productIdImage, setProductIdImage] = useState('');
  const [images, setListImages] = useState<ImageProduct[]>([]);
  const history = useHistory();

  const [modal, setModal] = useState({
    show: false,
    readOnly: true
  });

  const [newProduct, setNewProduct] = useState<EditableProduct>({
    name: '',
    description: '',
    price: 0,
  });


  const _listProducts = async () => {
    try {
      const products = await listProducts();
      if (products.length === 0) {
        setError('No registered products :(');
      }
      setProducts(products);
    } catch (err) {
      setError(err.message);
    }
  }
  const _listImages = async (productId: string) => {
    try {
      const images = await listImages(productId);
      setListImages(images);
    } catch (err) {
      setErrorModal(err.message);
    }
  }

  useEffect(() => {
    if(!isLogged()){
      history.push(CONST.PATH.SIGN_IN);
    }
    if (products?.length === 0 && !error) {
      _listProducts();
    }
  });

  const newProductModal = () => {
    setNewProduct({ name: '', description: '', price: 0 });
    setErrorModal('');
    setModal(old => ({
      ...old,
      show: true,
      readOnly: false
    }));
  }

  const handleSubmitNewProduct = async (event: any) => {
    event.preventDefault();
    setIsFetching(true);
    try {
      await setProduct(newProduct);
      setModal(old => ({
        ...old,
        show: false,
        readOnly: true
      }));
      _listProducts();
    } catch (err) {
      setErrorModal(err.message);
    }
    setIsFetching(false);
  };

  const handleSubmitImage = async (event: any) => {
    event.preventDefault();
    setIsFetching(true);
    const formData = new FormData();
    formData.append('productImage', modalImage);
    try {
      await saveImage(formData, productIdImage);
      _listImages(productIdImage);
      event.target.value = null;
    } catch (err) {
      setErrorModal(err.message);
    }
    setIsFetching(false);
  };

  const handleImageChange = (e: any) => {
    e.preventDefault();

    let file = e.target.files[0];
    setModalImage(file);
  }

  const handleSelectProduct = (product: Product) => {
    let editableProduct: EditableProduct = {
      ...product
    };
    editableProduct.isPublished = product.publishedAt ? true : false;
    setNewProduct(editableProduct);
    setModal(old => ({
      ...old,
      readOnly: true,
      show: true
    }));
  };

  const handleShowModalImage = (product: Product) => {
    setErrorModal('');
    setListImages([]);
    setShowModalImage(v => (true));
    if (product.id) {
      _listImages(product.id);
      setProductIdImage(product.id);
    }
  }
  const handleCancelModalImage = () => {
    setShowModalImage(v => (false));
  }
  
  const handleDeleteImage = async (image: ImageProduct) => {
    try{
      await deleteImage(image.productId, image.id);
      _listImages(productIdImage);
    }catch(err){
      setErrorModal(err.message)
    }
  }

  const handleSoftDelete = (product: Product) => {
    changeActiveProduct(product, false)
  }

  const handleRestoreDeleted = (product: Product) => {
    changeActiveProduct(product, true)
  }

  async function changeActiveProduct(product: Product, newState: boolean): Promise<void> {
    setIsFetching(true);
    let editableProduct: EditableProduct = {
      ...product
    };
    editableProduct.active = newState;
    try {
      await setProduct(editableProduct);
      setModal(old => ({
        ...old,
        show: false,
        readOnly: true
      }));
      _listProducts();
    } catch (err) {
      setError(err.message);
    }
    setIsFetching(false);
  }

  const bodyTable = () => {
    return products.map((p, i) =>
      <tr className="text-left" key={i} hidden={!p.active && !showDeleted}>
        <td >{p.name}</td>
        <td >{p.description.slice(0, 50)}{p.description.length > 50 ? '...' : ''}</td>
        <td>{p.price}</td>
        <td className="text-center">{p.publishedAt ? 'yes' : 'no'}</td>
        <th className="text-center">
          <Button className="m-1" variant="outline-danger" onClick={() => handleSoftDelete(p)} hidden={!p.active}>
            <DeleteRoundedIcon />
          </Button>
          <Button className="m-1" variant="outline-danger" onClick={() => handleRestoreDeleted(p)} hidden={p.active}>
            <SettingsBackupRestoreRoundedIcon />
          </Button>
          <Button className="m-1" variant="outline-dark" onClick={() => handleShowModalImage(p)}>
            <ImageRoundedIcon />
          </Button>
          <Button className="m-1" variant="outline-primary" onClick={() => handleSelectProduct(p)}>
            <InfoRoundedIcon />
          </Button>
        </th>
      </tr>
    );
  };

  const handleCloseModal = () => {
    setModal(m => ({
      ...m,
      show: false
    }));
  };

  const handleChangeValueFieldNewProduct = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { id, value, checked } = e.target;
    if (id === 'isPublished') {
      setNewProduct(ip => ({
        ...ip,
        isPublished: checked
      }));
    }
    setNewProduct(p => ({
      ...p,
      [id]: value
    }));
  }

  const showEditModal = () => {
    setModal(n => ({ ...n, readOnly: false }))
  };

  const handleShowDeleteds = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { checked } = e.target;
    setShowDeleted(() => (checked));
    _listProducts();
  };

  const myModal = () => {
    return (
      <Modal show={modal.show} onHide={handleCloseModal} backdrop="static" keyboard={false} size="lg" animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>{modal.readOnly ? 'Details' : 'New Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitNewProduct}>
            <Form.Group as={Row}>
              <Form.Label column sm="3">Name</Form.Label>
              <Col sm="9">
                <label className="text-secondary" hidden={!modal.readOnly}>{newProduct.name}</label>
                <Form.Control id="name" type="text" placeholder="Enter the name of the new product"
                  onChange={handleChangeValueFieldNewProduct} defaultValue={newProduct.name} hidden={modal.readOnly} />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="3">Description</Form.Label>
              <Col sm="9">
                <label className="text-secondary" hidden={!modal.readOnly}>{newProduct.description}</label>
                <Form.Control id="description" type="text" placeholder="Enter the description of the new product"
                  onChange={handleChangeValueFieldNewProduct} defaultValue={newProduct.description} hidden={modal.readOnly} />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="3">Price</Form.Label>
              <Col sm="9">
                <label className="text-secondary" hidden={!modal.readOnly}>{newProduct.price}</label>
                <Form.Control id="price" type="number" placeholder="Enter the price of the new product" step="0.01"
                  onChange={handleChangeValueFieldNewProduct} defaultValue={newProduct.price} hidden={modal.readOnly} />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Col sm="12" hidden={!modal.readOnly}>
                <label className="text-secondary" >
                  {newProduct.isPublished ? newProduct.publishedAt : 'Not published'}
                </label>
              </Col>
              <Col sm="12" hidden={modal.readOnly}>
                <Form.Check type="checkbox" id="isPublished" label="Publish"
                  onChange={handleChangeValueFieldNewProduct} hidden={modal.readOnly} defaultChecked={newProduct.isPublished} />
              </Col>
            </Form.Group>

            {errorModal && <p style={{
              border: '1px solid #e76f51',
              color: '#e76f51',
              padding: '5px 10px',
              backgroundColor: '#f8edeb',
              borderRadius: '5px'
            }}>
              {errorModal}</p>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" disabled={isFetching} onClick={handleCloseModal}>Cancel</Button>
          <Button variant="dark" disabled={isFetching} hidden={!modal.readOnly}
            onClick={showEditModal}>
            Edit
          </Button>
          <Button variant="primary" disabled={isFetching} hidden={modal.readOnly} onClick={handleSubmitNewProduct}>
            {isFetching ? 'Please, wait...' : 'Ok'}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const myModalImage = () => {
    return (
      <Modal show={showModalImage} onHide={handleCancelModalImage} backdrop="static" keyboard={false} size="lg" animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Product Images</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Carousel>
              {images.map((image, ind) => {
                return (
                  <Carousel.Item key={image.id}>
                    <Image src={CONST.BACKEND.BASE_URL+"/images/products/" + image.id} className="d-block w-100" />
                    <Carousel.Caption>
                      <Button variant="danger" disabled={isFetching} onClick={()=>handleDeleteImage(image)} className="shadow">
                        {isFetching ? 'Please, wait...' : 'Delete'}
                      </Button>
                    </Carousel.Caption>
                  </Carousel.Item>
                )
              })}
            </Carousel>
          </Container>
          <Form onSubmit={handleSubmitImage} className="p-4 m-2 mb-0">
            <Form.Group>
              <Form.File id="productImage" name="productImage" label="Upload some images of the product" onChange={handleImageChange} />
            </Form.Group>
          </Form>
          {errorModal && <p style={{
            border: '1px solid #e76f51',
            color: '#e76f51',
            padding: '5px 10px',
            backgroundColor: '#f8edeb',
            borderRadius: '5px'
          }}>
            {errorModal}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" disabled={isFetching} onClick={handleCancelModalImage}>Cancel</Button>
          <Button variant="primary" disabled={isFetching} onClick={handleSubmitImage}>
            {isFetching ? 'Please, wait...' : 'Ok'}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <Container className="col-12 col-md-12 p-4">
      {myModal()}
      {myModalImage()}
      <h2 className="text-left">My Products</h2>
      <Row className="p-3 float-right">
        <Button className="btn btn-primary " onClick={newProductModal}>
          <AddCircleOutlineRoundedIcon className="mr-2" />New Product
        </Button>
      </Row>

      <Row className="p-3 mt-5 mb-3 col-12">
        {error && <p style={{
          border: '1px solid #e76f51',
          color: '#e76f51',
          padding: '5px 10px',
          backgroundColor: '#f8edeb',
          borderRadius: '5px',
          width: '100%'
        }}>
          {error}</p>}
      </Row>

      <Form className="text-left" hidden={products.length === 0}>
        <Form.Group>
          <Form.Check type="checkbox" id="isPublished" label="Show deleteds" className="form-check form-switch"
            onChange={handleShowDeleteds} hidden={products.length === 0} checked={showDeleted} />
        </Form.Group>
      </Form>

      <Table size="sm bg-light rounded" responsive hidden={products.length === 0}>
        <thead>
          <tr className="bg-secondary text-light">
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Published</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {bodyTable()}
        </tbody>
      </Table>

      <Row className="p-3" hidden={products.length > 0 || error !== ''}>
        <Alert variant="info" className="col-12" >Loading Products... Please, wait...</Alert>
      </Row>
    </Container>
  );
}