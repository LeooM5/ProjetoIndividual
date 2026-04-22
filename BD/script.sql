create database projetoPessoal;

use projetoPessoal;

CREATE TABLE usuario (
    idusuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45),
    email VARCHAR(75),
    senha VARCHAR(25),
    termos TINYINT
);
  
SELECT 
    *
FROM
    usuario;